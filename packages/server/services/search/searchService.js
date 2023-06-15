const isEmpty = require('lodash/isEmpty')
const isFunction = require('lodash/isFunction')
const has = require('lodash/has')

const parseJsonField = (criterion, operator) => {
  const pieces = criterion.field.split('.')
  const lastPiece = pieces.pop()
  const objForQuery = {}
  objForQuery[lastPiece] = criterion.operator[operator]

  return {
    whereJsonSupersetOf: [pieces.join(':'), objForQuery],
  }
}

class SearchService {
  constructor(Model, options = {}) {
    this.debug = options.debug || false
    this.skip = options.skip || 0
    this.take = options.take || -1
    this.filter = this.parseOptionsToFilter(options.filter || [])
    this.join = options.join || []
    this.groupBy = options.groupBy || null
    this.sort = options.sort || null
    this.having = options.having || {}
    this.textFullSearch = options.textFullSearch || null

    this.or = options.or

    this.query = Model.query()
  }

  get metadata() {
    return {
      skip: this.skip,
      take: this.take,
      total: this.total[0].count,
    }
  }

  /* eslint-disable-next-line class-methods-use-this */
  parseCriterion(criterion) {
    if (isEmpty(criterion.operator) && !Array.isArray(criterion.or)) return null

    if (criterion.or) {
      const orCriteria = this.parseOptionsToFilter(criterion.or)

      const orFn = builder => {
        orCriteria.reduce((accumulator, current, index) => {
          const fn = Object.keys(current)[0]
          const fnArgs = current[fn]

          if (index === 0) return builder.where(...fnArgs)
          return builder.orWhere(...fnArgs)
        }, builder)
      }

      return { where: orFn }
    }

    if (
      criterion.operator.fullSearch === '' ||
      criterion.operator.contains === '' ||
      criterion.operator.eq === '' ||
      criterion.operator.eq === null
    ) {
      return null
    }

    if (criterion.operator.fullSearch) {
      return {
        whereRaw: [
          `${criterion.field} @@ to_tsquery(?)`,
          [`${criterion.operator.fullSearch}:*`],
        ],
      }
    }

    if ('is' in criterion.operator) {
      if (criterion.field.includes('.')) {
        return parseJsonField(criterion, 'is')
      }

      return {
        where: [criterion.field, criterion.operator.is],
      }
    }

    if (criterion.operator.eq) {
      if (criterion.field.includes('.')) {
        return parseJsonField(criterion, 'eq')
      }

      return {
        where: [criterion.field, criterion.operator.eq],
      }
    }

    if (has(criterion, 'operator.noteq')) {
      return {
        whereNot: [criterion.field, criterion.operator.noteq],
      }
    }

    if (criterion.operator.contains) {
      return {
        where: [
          `${criterion.field}`,
          `ilike`,
          `%${criterion.operator.contains}%`,
        ],
      }
    }

    if (criterion.operator.in) {
      return {
        whereIn: [criterion.field, criterion.operator.in],
      }
    }

    return criterion
  }

  parseOptionsToFilter(filter) {
    const parsed = filter
      .map(f => this.parseCriterion(f))
      .filter(f => f != null)

    return parsed
  }

  select(select) {
    this.query = this.query.clearSelect()

    if (isEmpty(select)) {
      this.query.select()
    } else {
      this.query.select(select)
    }

    return this
  }

  joinClause() {
    if (this.join.length > 0) {
      const reducer = (accumulator, currentValue) => {
        const fn = Object.keys(currentValue)[0]
        return accumulator[fn].apply(this.query, currentValue[fn])
      }

      this.query = this.join.reduce(reducer, this.query)
    }

    return this
  }

  whereClause() {
    if (this.filter.length > 0) {
      const reducer = (accumulator, currentValue) => {
        const fn = Object.keys(currentValue)[0]
        let whereArgs = currentValue[fn]
        if (isFunction(whereArgs)) whereArgs = [whereArgs]

        return accumulator[fn].apply(this.query, whereArgs)
      }

      this.query = this.filter.reduce(reducer, this.query)
    }

    return this
  }

  limit() {
    if (this.take < 0) return this
    this.query = this.query.limit(this.take)
    return this
  }

  offset() {
    if (this.take < 0) return this
    this.query = this.query.offset(this.skip)
    return this
  }

  groupby() {
    if (!this.groupBy) return this
    this.query = this.query.groupBy(this.groupBy)
    return this
  }

  rawHaving() {
    if (isEmpty(this.having)) return this
    this.query = this.query.havingRaw(this.having.query, this.having.value)
    return this
  }

  order() {
    if (!isEmpty(this.sort)) {
      this.query = this.query.orderBy(this.sort.field[0], this.sort.direction)
    }

    return this
  }

  async search(select = []) {
    this.joinClause()
    this.whereClause()
    // this.total = await this.query.count('*')

    this.select(select).groupby().rawHaving().offset().limit().order()

    return this.debug ? this.query.debug : this.query
  }
}

module.exports = SearchService
