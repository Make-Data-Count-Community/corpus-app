import React from 'react'
import { CitationCountsByPublisher, VisuallyHiddenElement } from '../ui'

const CitationCountsByPublisherPage = () => {
  return (
    <>
      <VisuallyHiddenElement as="h1">
        Citation counts by publisher page
      </VisuallyHiddenElement>
      <CitationCountsByPublisher />
      <VisuallyHiddenElement
        aria-live="polite"
        as="div"
        id="search-results-update"
        role="status"
      />
    </>
  )
}

export default CitationCountsByPublisherPage
