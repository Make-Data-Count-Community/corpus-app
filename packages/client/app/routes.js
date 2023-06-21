import React, { useState, useEffect } from 'react'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { PageLayout as Page } from '@coko/client'

import { Header, VisuallyHiddenElement } from './ui'
import GlobalStyles from './globalStyles'

import {
  Dashboard,
  CitationCountsOverTime,
  CitationCountsBySubject,
  CitationCountsByPublisher,
  CitationCountsBySource,
  UniqueCitationCounts,
  CitationCorpusGrowth,
} from './pages'

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const regexPaths = [
  {
    path: /^\/dashboard$/,
    name: 'Dashboard page',
  },
  {
    path: /^\/visualisation\/citation-counts-over-time$/,
    name: 'Citation counts over time page',
  },
  {
    path: /^\/visualisation\/citation-counts-by-subject$/,
    name: 'Citation counts by subject page',
  },
  {
    path: /^\/visualisation\/citation-counts-by-publisher$/,
    name: 'Citation counts by publisher page',
  },
  {
    path: /^\/visualisation\/citation-counts-by-source$/,
    name: 'Citation counts by source of citation page',
  },
  {
    path: /^\/visualisation\/unique-citation-counts$/,
    name: 'Counts of unique repositories, journals, subjects, affiliations, funders page',
  },
  {
    path: /^\/visualisation\/citation-corpus-growth$/,
    name: 'Data citations corpus growth',
  },
]

const Layout = props => {
  const { children } = props

  const history = useHistory()

  useEffect(() => {
    const path = history.location.pathname
    const title = regexPaths.find(p => p.path.test(path))

    if (title) {
      document.title = `${title?.name} - Data Citation Corpus`
    }

    const unlisten = history.listen(val => {
      const pathName = val.pathname
      const pathTitle = regexPaths.find(p => p.path.test(pathName))

      if (pathTitle) {
        document.getElementById('page-announcement').innerHTML = pathTitle?.name

        document.title = `${pathTitle?.name} - Data Citation Corpus`
      }
    })

    return unlisten
  }, [])

  return (
    <LayoutWrapper>
      {children}
      <VisuallyHiddenElement
        aria-live="polite"
        as="div"
        id="page-announcement"
        role="status"
      />
    </LayoutWrapper>
  )
}

const StyledPage = styled(Page)`
  height: calc(100% - 60px);
`

const SiteHeader = () => {
  const headerLinks = {
    homepage: '/',
    dashboard: '/dashboard',
  }

  const history = useHistory()
  const [currentPath, setCurrentPath] = useState(history.location.pathname)

  useEffect(() => {
    const unlisten = history.listen(val => setCurrentPath(val.pathname))

    return unlisten
  }, [])

  return <Header currentPath={currentPath} links={headerLinks} />
}

const StyledMain = styled.main`
  height: 100%;
`

const routes = (
  <Layout>
    <GlobalStyles />
    <SiteHeader />
    <StyledPage fadeInPages={false} padPages={false}>
      <StyledMain id="main-content" tabIndex="-1">
        <Switch>
          <Route component={Dashboard} exact path="/dashboard" />
          <Route
            component={CitationCountsOverTime}
            exact
            path="/visualisation/citation-counts-over-time"
          />
          <Route
            component={CitationCountsBySubject}
            exact
            path="/visualisation/citation-counts-by-subject"
          />
          <Route
            component={CitationCountsByPublisher}
            exact
            path="/visualisation/citation-counts-by-publisher"
          />
          <Route
            component={CitationCountsBySource}
            exact
            path="/visualisation/citation-counts-by-source"
          />
          <Route
            component={UniqueCitationCounts}
            exact
            path="/visualisation/unique-citation-counts"
          />
          <Route
            component={CitationCorpusGrowth}
            exact
            path="/visualisation/citation-corpus-growth"
          />
          <Route component={() => <Redirect to="/dashboard" />} path="*" />
        </Switch>
      </StyledMain>
    </StyledPage>
  </Layout>
)

export default routes
