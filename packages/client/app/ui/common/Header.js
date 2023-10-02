/* stylelint-disable string-quotes */
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'

import DataCiteLogo from '../../../static/logo-datacite-header.svg'

// #region styles
const StyledHeader = styled.header`
  align-items: center;
  background-color: ${th('colorPrimary')};
  /* box-shadow: -5px 5px 18px -2px ${th('colorText')}; */
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: ${th('headerPaddingVertical')} ${grid(4)};
  width: 100%;
  z-index: 9;

  @media screen and (min-width: ${th('mediaQueries.medium')}) {
    padding: ${th('headerPaddingVertical')} ${grid(5)};
  }

  @media screen and (min-width: ${th('mediaQueries.large')}) {
    flex-direction: row;
    /* height: 110px; */
    justify-content: unset;
  }
`

const Branding = styled(Link)`
  background-image: url(${DataCiteLogo});
  display: block;
  height: ${th('mobileLogoHeight')};
  margin-right: 30px;
  overflow: hidden;
  transition: outline 200ms ease-in;
  width: 195px;

  h1 {
    height: 0;
    overflow: hidden;
    width: 0;
  }

  &:hover,
  &:focus {
    outline: 1px solid ${th('colorTextReverse')};
  }
`

const Navigation = styled.nav`
  align-items: center;
  display: flex;
  flex-basis: 40px;
  height: ${th('mobileLogoHeight')};
  justify-content: center;
  overflow: visible;

  @media screen and (min-width: ${th('mediaQueries.large')}) {
    align-items: center;
    background-color: ${th('colorBody')};
    display: flex;
    flex-grow: 1;
    /* height: auto; */
    justify-content: space-between;
    margin: 0;
    padding: 0;
  }
`

const StyledList = styled.ul`
  align-items: center;
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;

  > li {
    color: ${th('colorTextDark')};
    font-size: ${th('fontSizeBase')};
    line-height: 2.5rem;

    > a {
      display: inline-flex;
      width: 100%;
    }
  }

  @media screen and (min-width: ${th('mediaQueries.large')}) {
    align-items: center;
    display: flex;
    height: 3.0625rem;
    padding: 0;

    > li {
      align-items: center;
      color: ${th('colorTextReverse')};
      display: inline-flex;
      line-height: inherit;

      &:not(:first-child:last-child) {
        margin-right: 1rem;
      }
    }
  }
`

const NavLinks = styled.div`
  background-color: ${th('colorPrimary')};
  display: none;
  height: calc(
    100vh - (${th('mobileLogoHeight')} + 2 * ${th('headerPaddingVertical')})
  );
  left: 0;
  overflow: auto;
  padding: ${grid(6)} ${grid(4)}; // 1.5rem 1rem;
  position: absolute;
  top: calc(${th('mobileLogoHeight')} + 2 * ${th('headerPaddingVertical')});
  width: 100%;

  @media screen and (min-width: ${th('mediaQueries.large')}) {
    background-color: ${th('colorPrimary')};
    display: flex;
    height: auto;
    justify-content: space-between;
    left: unset;
    overflow: initial;
    padding: 0;
    position: relative;
    top: unset;
  }
`

const StyledLink = styled(Link)`
  color: inherit;
  display: inline-block;
  font-size: ${th('fontSizeHeading1')};
  font-weight: 500;
  line-height: ${grid(7.75)};
  overflow-x: hidden;
  padding: 10px 0;
  text-decoration: none;

  span::after {
    background-color: ${th('colorTertiary')};
    content: '';
    display: block;
    height: 2px;
    margin-top: 0;
    transform: translateX(-101%);
    transition: all 200ms ease-out;
    width: 100%;
  }

  &:hover,
  &:focus,
  &[aria-current='page'] {
    color: inherit;

    span::after {
      transform: translateX(0);
    }
  }

  @media screen and (min-width: ${th('mediaQueries.large')}) {
    line-height: 1.5;
    padding: 0;

    span::after {
      background-color: ${th('colorTextReverse')};
    }
  }
`

const SkipLink = styled.a`
  background-color: ${th('colorTextDark')};
  border-radius: 0 0 ${grid(1)} ${grid(1)};
  color: ${th('colorTextReverse')};
  height: 30px;
  left: 50%;
  padding: ${grid(1)} ${grid(2)};
  position: absolute;
  top: -100px;
  transform: translateX(-50%);
  transition: top 300ms ease-in;
  width: auto;
  z-index: 3;

  &:focus {
    top: 0;
  }
`
// #endregion styles

const Header = props => {
  const {
    currentPath,
    links: { homepage, dashboard },
    ...rest
  } = props

  return (
    <StyledHeader role="banner" {...rest}>
      <SkipLink
        // have an href to be valid link
        href="#main-content"
        // focus main element with js to avoid polluting the url with #main-content
        onClick={e => {
          e.preventDefault()
          document.getElementById('main-content').focus()
        }}
      >
        Skip to main content
      </SkipLink>
      <Branding to={homepage}>
        <h1>Data Citation Corpus Prototype</h1>
      </Branding>
      <Navigation role="navigation">
        <NavLinks id="main-nav">
          <StyledList>
            <li>
              <StyledLink
                aria-current={currentPath === dashboard ? 'page' : false}
                to={dashboard}
              >
                <span>Data Citation Corpus Prototype</span>
              </StyledLink>
            </li>
          </StyledList>
        </NavLinks>
      </Navigation>
    </StyledHeader>
  )
}

Header.propTypes = {
  currentPath: PropTypes.string.isRequired,
  links: PropTypes.shape({
    homepage: PropTypes.string,
    dashboard: PropTypes.string,
  }),
}

Header.defaultProps = {
  links: {
    homepage: '#',
    dashboard: '#',
    profile: '#',
    login: '#',
  },
}

export default Header
