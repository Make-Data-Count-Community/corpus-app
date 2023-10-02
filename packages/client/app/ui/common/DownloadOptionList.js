import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid } from '@coko/client'
import { List as AntList } from 'antd'

import DownloadOption from './DownloadOption'

const Wrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  padding: ${grid(0)};
  width: ${grid(64)};
`

const List = styled(AntList)`
  width: 100%;
`

const DownloadOptionList = props => {
  const { options, onOptionClick } = props

  return (
    <Wrapper>
      <List
        dataSource={options}
        renderItem={item => (
          <DownloadOption
            key={item.type}
            label={item.label}
            onOptionClick={onOptionClick}
            symbol={item.symbol}
            type={item.type}
          />
        )}
      />
    </Wrapper>
  )
}

DownloadOptionList.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      label: PropTypes.string,
      symbol: PropTypes.string,
    }),
  ).isRequired,
  onOptionClick: PropTypes.func.isRequired,
}

export default DownloadOptionList
