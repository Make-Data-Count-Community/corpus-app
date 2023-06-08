import React from 'react'
import { Dashboard, VisuallyHiddenElement } from '../ui'

const DashboardPage = () => {
  return (
    <>
      <VisuallyHiddenElement as="h1">Dashboard page</VisuallyHiddenElement>
      <Dashboard
        byPublisherShowExpandButton
        bySourceShowExpandButton
        bySubjectShowExpandButton
        corpusGrowthShowExpandButton
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
