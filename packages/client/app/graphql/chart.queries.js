import { gql } from '@apollo/client'

// eslint-disable-next-line import/prefer-default-export
export const GET_BY_YEAR = gql`
  query GetByYear($input: SearchModelInput) {
    getAssertionsPerYear(input: $input) {
      id
      xField
      yField
      stackField
    }
  }
`

// export const GET_BY_SUBJECT = gql``
