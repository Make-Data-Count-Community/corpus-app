import { gql } from '@apollo/client'

export const GET_FULL_FACET_OPTIONS = gql`
  query GetFacets {
    getAffiliations {
      id
      title
    }
    getFunders {
      id
      title
    }
    getSubjects {
      id
      title
    }
    getPublishers {
      id
      title
    }
    getRepositories {
      id
      title
    }
    getJournals {
      id
      title
    }
  }
`

export const GET_BY_YEAR = gql`
  query OverTime($input: SearchModelInput) {
    getAssertionsPerYear(input: $input) {
      id
      xField
      yField
      stackField
    }
  }
`

// export const GET_BY_SUBJECT = gql``
