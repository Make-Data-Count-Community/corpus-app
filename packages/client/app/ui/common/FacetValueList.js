import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid } from '@coko/client'
import { List as AntList } from 'antd'

import FacetValueItem from './FacetValueItem'

const FacetValueListWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  padding: ${grid(0)};
  width: 100%;
`

const List = styled(AntList)`
  width: 100%;
`

const FacetValueList = props => {
  const { selectedFacetValues, onItemClick, valueOptions, onEmptyListLabel } =
    props

  return (
    <FacetValueListWrapper>
      <List
        dataSource={valueOptions}
        locale={{ emptyText: onEmptyListLabel }}
        renderItem={item => (
          <FacetValueItem
            id={item.id}
            isItemSelected={!!selectedFacetValues.find(f => f.id === item.id)}
            key={item.id}
            onItemClick={onItemClick}
            value={item.title}
          />
        )}
      />
    </FacetValueListWrapper>
  )
}

FacetValueList.propTypes = {
  selectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  onItemClick: PropTypes.func,
  valueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  onEmptyListLabel: PropTypes.string,
}

FacetValueList.defaultProps = {
  selectedFacetValues: [],
  onItemClick: () => {},
  valueOptions: [],
  onEmptyListLabel: '',
}

export default FacetValueList
