import React from 'react' // { useEffect }
import { useQuery } from '@apollo/client' // useLazyQuery,
import { Dashboard, VisuallyHiddenElement } from '../ui'

import { GET_BY_YEAR } from '../graphql'

const DashboardPage = () => {
  const { data: byYearData, loading: byYearDataLoading } = useQuery(
    GET_BY_YEAR,
    // {
    //   variables: {
    //     params: {},
    //     options: {},
    //   },
    // },
  )

  //   const [byYearQuery, { data: byYearData, loading: byYearDataLoading }] =
  //     useLazyQuery(GET_BY_YEAR)

  //   useEffect(() => {
  //     byYearQuery()
  //   }, [])

  return (
    <>
      <VisuallyHiddenElement as="h1">Dashboard page</VisuallyHiddenElement>
      <Dashboard
        byPublisherShowExpandButton
        bySourceShowExpandButton
        bySubjectShowExpandButton
        corpusGrowthShowExpandButton
        overTimeData={byYearData}
        overTimeLoading={byYearDataLoading}
        overTimeShowExpandButton
        uniqueCountShowExpandButton
      />
      <VisuallyHiddenElement
        aria-live="polite"
        as="div"
        id="search-results-update"
        role="status"
      />
    </>
  )
}

export default DashboardPage
