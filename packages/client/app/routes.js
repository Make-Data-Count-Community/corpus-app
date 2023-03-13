import React, { useState, useEffect } from 'react'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { PageLayout as Page } from '@coko/client'

import { Header, VisuallyHiddenElement } from './ui'
import GlobalStyles from './globalStyles'

import { Dashboard } from './pages'

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
]

const Layout = props => {
  const { children } = props

  const history = useHistory()

  useEffect(() => {
    const path = history.location.pathname
    const title = regexPaths.find(p => p.path.test(path))

    if (title) {
      document.title = `${title?.name} - App Template`
    }

    const unlisten = history.listen(val => {
      const pathName = val.pathname
      const pathTitle = regexPaths.find(p => p.path.test(pathName))

      if (pathTitle) {
        document.getElementById('page-announcement').innerHTML = pathTitle?.name

        document.title = `${pathTitle?.name} - App Template`
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
  height: calc(100% - 64px - 40px);
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
          <Route exact path="/dashboard" render={Dashboard} />
          <Route component={() => <Redirect to="/dashboard" />} path="*" />
        </Switch>
      </StyledMain>
    </StyledPage>
  </Layout>
)

export default routes
