import React from 'react'
import { UniqueCitationCounts, VisuallyHiddenElement } from '../ui'

const UniqueCitationCountsPage = () => {
  return (
    <>
      <VisuallyHiddenElement as="h1">
        Counts of unique repositories, journals, subjects, affiliations, funders
        page
      </VisuallyHiddenElement>
      <UniqueCitationCounts />
      <VisuallyHiddenElement
        aria-live="polite"
        as="div"
        id="search-results-update"
        role="status"
      />
    </>
  )
}

export default UniqueCitationCountsPage
