/* stylelint-disable string-quotes */
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  TwitterOutlined,
  GithubOutlined,
  YoutubeFilled,
  LinkedinFilled,
} from '@ant-design/icons'
import { grid, th } from '@coko/client'

import DataCiteLogo from '../../../static/logo-datacite-footer.svg'

const StyledFooter = styled.footer`
  background-color: ${th('colorPrimary')};
  /* color: ${th('colorTextReverse')}; */
  display: flex;
  flex-direction: column;
  /* height: 40px; */
  justify-content: space-between;
  padding: ${grid(4)} ${grid(8)};

  @media screen and (min-width: ${th('mediaQueries.small')}) {
    flex-direction: column;
  }
`

const FooterSection = styled.div`
  display: flex;
  flex-direction: row;
  /* flex-wrap: wrap; */
  gap: ${grid(4)};
  justify-content: space-between;
  ${({ showBorder }) =>
    showBorder && `border-bottom: 1px solid rgba(170, 170, 170, 32%);`}
  padding: ${grid(4)} 0;

  @media screen and (max-width: ${th('mediaQueries.medium')}) {
    flex-direction: column;
  }
`

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${grid(4)};
`

const FooterListTitle = styled.span`
  color: ${th('colorSecondary')};
  font-size: ${th('fontSizeBase')};
  font-weight: 500;
  line-height: ${grid(5)};
`

const Branding = styled(Link)`
  background-image: url(${DataCiteLogo});
  display: block;
  height: ${grid(9)};
  margin-right: 30px;
  overflow: hidden;
  transition: outline 200ms ease-in;
  width: ${grid(44)};

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

const StyledTwitter = styled(TwitterOutlined)`
  font-size: ${grid(5)};
`

const StyledGithub = styled(GithubOutlined)`
  font-size: ${grid(5)};
`

const StyledYouTube = styled(YoutubeFilled)`
  font-size: ${grid(5)};
`

const StyledLinkedin = styled(LinkedinFilled)`
  font-size: ${grid(5)};
`

const FooterList = styled.ul`
  display: flex;
  justify-content: center;
  margin: 0;
  ${({ horizontal }) => `flex-direction: ${horizontal ? 'row' : 'column'}`};
  padding: 0;

  @media screen and (min-width: ${th('mediaQueries.medium')}) {
    justify-content: left;
  }

  li {
    font-family: ${th('fontSecondaryInterface')};
    font-size: ${th('fontSizeBaseMedium')};
    list-style: none;
    ${({ social }) => social && `margin: 0 8px;`}
    ${({ social }) => social && `display: inline-block;`}

    @media screen and (min-width: ${th('mediaQueries.medium')}) {
      display: inline-flex;
      ${({ horizontal }) => horizontal && `margin: 0 12px;`}
    }

    a {
      color: rgba(255 255 255 / 60%);
      /* color: ${th('colorTextFooter')}; */

      &:link,
      &:visited,
      &:hover,
      &:active {
        text-decoration: none;
      }

      &:hover {
        color: ${th('colorTertiary')};
      }
    }
  }
`

const Footer = props => {
  const {
    links: {
      homepage,
      termsOfUse,
      privacyPolicy,
      twitterUrl,
      githubUrl,
      youtubeUrl,
      linkedinUrl,
      contactUs,
      blog,
      team,
      whatWeDo,
      governance,
      jobOpportunities,
      steeringGroups,
      createDois,
      discoverMetadata,
      integrateApis,
      partnerServices,
      metadataSchema,
      support,
      feeModel,
      members,
      partners,
      serviceProviders,
      roadmap,
      fairWorkflows,
      imprint,
    },
    ...rest
  } = props

  return (
    <StyledFooter role="contentinfo" {...rest}>
      <FooterSection showBorder>
        <FooterColumn>
          <Branding to={homepage}>
            <h1>Data Citation Corpus</h1>
          </Branding>
          <FooterList horizontal social>
            <li>
              <a href={twitterUrl} rel="noreferrer" target="_blank">
                <StyledTwitter />
              </a>
            </li>
            <li>
              <a href={githubUrl} rel="noreferrer" target="_blank">
                <StyledGithub />
              </a>
            </li>
            <li>
              <a href={youtubeUrl} rel="noreferrer" target="_blank">
                <StyledYouTube />
              </a>
            </li>
            <li>
              <a href={linkedinUrl} rel="noreferrer" target="_blank">
                <StyledLinkedin />
              </a>
            </li>
          </FooterList>
          <FooterList>
            <li>
              <a href={contactUs} rel="noreferrer" target="_blank">
                Contact us
              </a>
            </li>

            <li>
              <a href={blog} rel="noreferrer" target="_blank">
                Blog
              </a>
            </li>
          </FooterList>
        </FooterColumn>
        <FooterColumn>
          <FooterListTitle>About us</FooterListTitle>
          <FooterList>
            <li>
              <a href={whatWeDo} rel="noreferrer" target="_blank">
                What we do
              </a>
            </li>

            <li>
              <a href={governance} rel="noreferrer" target="_blank">
                Governance
              </a>
            </li>
            <li>
              <a href={steeringGroups} rel="noreferrer" target="_blank">
                Steering groups
              </a>
            </li>

            <li>
              <a href={team} rel="noreferrer" target="_blank">
                Team
              </a>
            </li>

            <li>
              <a href={jobOpportunities} rel="noreferrer" target="_blank">
                Job opportunities
              </a>
            </li>
          </FooterList>
        </FooterColumn>
        <FooterColumn>
          <FooterListTitle>Services</FooterListTitle>
          <FooterList>
            <li>
              <a href={createDois} rel="noreferrer" target="_blank">
                Create DOIs with Fabrica
              </a>
            </li>

            <li>
              <a href={discoverMetadata} rel="noreferrer" target="_blank">
                Discover metadata with Commons
              </a>
            </li>
            <li>
              <a href={integrateApis} rel="noreferrer" target="_blank">
                Integrate with APIs
              </a>
            </li>

            <li>
              <a href={partnerServices} rel="noreferrer" target="_blank">
                Partner Services
              </a>
            </li>
          </FooterList>
        </FooterColumn>
        <FooterColumn>
          <FooterListTitle>Resources</FooterListTitle>
          <FooterList>
            <li>
              <a href={metadataSchema} rel="noreferrer" target="_blank">
                Metadata schema
              </a>
            </li>

            <li>
              <a href={support} rel="noreferrer" target="_blank">
                Support
              </a>
            </li>
            <li>
              <a href={feeModel} rel="noreferrer" target="_blank">
                Fee Model
              </a>
            </li>
          </FooterList>
        </FooterColumn>
        <FooterColumn>
          <FooterListTitle>Community</FooterListTitle>
          <FooterList>
            <li>
              <a href={members} rel="noreferrer" target="_blank">
                Members
              </a>
            </li>

            <li>
              <a href={partners} rel="noreferrer" target="_blank">
                Partners
              </a>
            </li>
            <li>
              <a href={steeringGroups} rel="noreferrer" target="_blank">
                Steering groups
              </a>
            </li>

            <li>
              <a href={serviceProviders} rel="noreferrer" target="_blank">
                Service providers
              </a>
            </li>

            <li>
              <a href={roadmap} rel="noreferrer" target="_blank">
                Roadmap
              </a>
            </li>
            <li>
              <a href={fairWorkflows} rel="noreferrer" target="_blank">
                FAIR Workflows
              </a>
            </li>
          </FooterList>
        </FooterColumn>
      </FooterSection>
      <FooterSection>
        <FooterColumn>
          <FooterList>
            <li>
              <a href={imprint} rel="noreferrer" target="_blank">
                Imprint
              </a>
            </li>
          </FooterList>
        </FooterColumn>
        <FooterColumn>
          <FooterList horizontal>
            <li>
              <a href={privacyPolicy} rel="noreferrer" target="_blank">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href={termsOfUse} rel="noreferrer" target="_blank">
                Terms and conditions
              </a>
            </li>
          </FooterList>
        </FooterColumn>
      </FooterSection>

      {/* <SiteLogo rel="Home" title="Home" to={homepage}>
        <h1>Assesment Builder</h1>
      </SiteLogo> */}
    </StyledFooter>
  )
}

Footer.propTypes = {
  links: PropTypes.shape({
    homepage: PropTypes.string,
    twitterUrl: PropTypes.string,
    githubUrl: PropTypes.string,
    linkedinUrl: PropTypes.string,
    youtubeUrl: PropTypes.string,
    termsOfUse: PropTypes.string,
    privacyPolicy: PropTypes.string,
    contactUs: PropTypes.string,
    blog: PropTypes.string,
    team: PropTypes.string,
    whatWeDo: PropTypes.string,
    governance: PropTypes.string,
    jobOpportunities: PropTypes.string,
    steeringGroups: PropTypes.string,
    createDois: PropTypes.string,
    discoverMetadata: PropTypes.string,
    integrateApis: PropTypes.string,
    partnerServices: PropTypes.string,
    metadataSchema: PropTypes.string,
    support: PropTypes.string,
    feeModel: PropTypes.string,
    members: PropTypes.string,
    partners: PropTypes.string,
    serviceProviders: PropTypes.string,
    roadmap: PropTypes.string,
    fairWorkflows: PropTypes.string,
    imprint: PropTypes.string,
  }),
}

Footer.defaultProps = {
  links: {
    homepage: '#',
    twitterUrl: '#',
    githubUrl: '#',
    linkedinUrl: '#',
    youtubeUrl: '#',
    termsOfUse: '#',
    privacyPolicy: '#',
    contactUs: '#',
    blog: '#',
    team: '#',
    whatWeDo: '#',
    governance: '#',
    jobOpportunities: '#',
    steeringGroups: '#',
    createDois: '#',
    discoverMetadata: '#',
    integrateApis: '#',
    partnerServices: '#',
    metadataSchema: '#',
    support: '#',
    feeModel: '#',
    members: '#',
    partners: '#',
    serviceProviders: '#',
    roadmap: '#',
    fairWorkflows: '#',
    imprint: '#',
  },
}

export default Footer
