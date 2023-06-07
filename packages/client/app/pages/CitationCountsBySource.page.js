import React from 'react'
import { CitationCountsBySource, VisuallyHiddenElement } from '../ui'

const CitationCountsBySourcePage = () => {
  return (
    <>
      <VisuallyHiddenElement as="h1">
        Citation counts by source of citation page
      </VisuallyHiddenElement>
      <CitationCountsBySource />
      <VisuallyHiddenElement
        aria-live="polite"
        as="div"
        id="search-results-update"
        role="status"
      />
    </>
  )
}

export default CitationCountsBySourcePage
