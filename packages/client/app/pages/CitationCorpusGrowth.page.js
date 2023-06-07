import React from 'react'
import { CitationCorpusGrowth, VisuallyHiddenElement } from '../ui'

const CitationCorpusGrowthPage = () => {
  return (
    <>
      <VisuallyHiddenElement as="h1">
        Data citations corpus growth
      </VisuallyHiddenElement>
      <CitationCorpusGrowth />
      <VisuallyHiddenElement
        aria-live="polite"
        as="div"
        id="search-results-update"
        role="status"
      />
    </>
  )
}

export default CitationCorpusGrowthPage
