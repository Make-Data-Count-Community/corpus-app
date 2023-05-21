import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Table as AntTable } from 'antd'
import { grid } from '@coko/client'

const Wrapper = styled.div`
  /* align-items: center; */
  /* display: flex; */
  /* isolation: isolate; */
  /* justify-content: center; */
  padding: ${grid(5)} ${grid(0)} ${grid(7)};
  /* width: 100%; */
`

const antTableExpandableOptions = { childrenColumnName: 'antdChildren' }

const Table = props => {
  const { data, columns } = props

  return (
    <Wrapper>
      <AntTable
        columns={columns}
        dataSource={data}
        expandable={antTableExpandableOptions}
        pagination={false}
      />
    </Wrapper>
  )
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
}

export default Table
