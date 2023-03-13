import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  font-size: 20px;
  font-weight: bold;
  height: 300px;
  left: 50%;
  margin: -50px 0 0 -50px;
  position: absolute;
  top: 50%;
  width: 300px;
`

const Dashboard = () => <Wrapper>Welcome to Coko Dashboard!</Wrapper>

Dashboard.propTypes = {}

Dashboard.defaultProps = {}

export default Dashboard
