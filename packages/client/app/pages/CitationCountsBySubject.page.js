import React from 'react'
import { CitationCountsBySubject, VisuallyHiddenElement } from '../ui'

const CitationCountsBySubjectPage = () => {
  return (
    <>
      <VisuallyHiddenElement as="h1">
        Citation counts by subject page
      </VisuallyHiddenElement>
      <CitationCountsBySubject />
      <VisuallyHiddenElement
        aria-live="polite"
        as="div"
        id="search-results-update"
        role="status"
      />
    </>
  )
}

export default CitationCountsBySubjectPage
