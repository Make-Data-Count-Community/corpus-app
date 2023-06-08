import React from 'react'
import { CitationCountsOverTime, VisuallyHiddenElement } from '../ui'

const CitationCountsOverTimePage = () => {
  return (
    <>
      <VisuallyHiddenElement as="h1">
        Citation counts over time page
      </VisuallyHiddenElement>
      <CitationCountsOverTime />
      <VisuallyHiddenElement
        aria-live="polite"
        as="div"
        id="search-results-update"
        role="status"
      />
    </>
  )
}

export default CitationCountsOverTimePage
