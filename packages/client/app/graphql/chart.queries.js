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

export const GET_BY_SUBJECT = gql`
  query BySubject($input: SearchModelInput) {
    getAssertionsPerSubject(input: $input) {
      id
      xField
      yField
    }
  }
`

export const GET_BY_PUBLISHER = gql`
  query ByPublisher($input: SearchModelInput) {
    getAssertionsPerPublisher(input: $input) {
      id
      xField
      yField
    }
  }
`

export const GET_BY_SOURCE = gql`
  query BySource($input: SearchModelInput) {
    getAssertionCountsPerSource(input: $input) {
      id
      xField
      yField
      stackField
    }
  }
`

// export const GET_UNIQUE_COUNT = gql`
// query BySource($input: SearchModelInput) {
//   getAssertionUniqueCounts(input: $input) {
// 	facet
// 	thirdPartyAggr
// 	pidMetadata
//   }
// }`

// export const GET_CORPUS_GROWTH = gql`
//   query CorpusGrowth($input: SearchModelInput) {
//     getCorpusGrowth(input: $input) {
//       id
//       xField
//       yField
//       stackField
//     }
//   }
// `
