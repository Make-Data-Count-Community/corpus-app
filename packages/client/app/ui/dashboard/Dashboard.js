import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { th, grid } from '@coko/client'

import { Header, Footer } from '../common'
import {
  CitationCorpusGrowth,
  CitationCountsByPublisher,
  CitationCountsBySource,
  CitationCountsBySubject,
  CitationCountsOverTime,
  UniqueCitationCounts,
} from '../visualisation'

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const VisualisationRow = styled.div`
  align-items: stretch;
  display: flex;
  flex-direction: row;
  /* gap: ${grid(4)}; */
  /* justify-content: space-between; */
  /* margin: ${grid(8)}; */
  margin: ${grid(5)} 0;
  overflow: hidden;
  padding: ${grid(0)};
  width: 100%;

  @media screen and (max-width: ${th('mediaQueries.medium')}) {
    flex-direction: column;
  }
`

// const VisualisationWrapper = styled.div`
//   display: flex;
//   padding: ${grid(0)};
//   width: 100%;
// `

const Dashboard = props => {
  const {
    currentPath,
    footerLinks,
    headerLinks,

    corpusGrowthData,
    corpusGrowthIsDownloadListOpen,
    corpusGrowthOnDownloadOptionClick,
    corpusGrowthOnExpandClick,
    corpusGrowthOnFooterTabClick,
    corpusGrowthOnNewView,
    corpusGrowthSelectedFooterTab,
    corpusGrowthTableColumns,

    uniqueCountData,
    uniqueCountIsDownloadListOpen,
    uniqueCountOnDownloadOptionClick,
    uniqueCountOnExpandClick,
    uniqueCountOnFooterTabClick,
    uniqueCountSelectedFooterTab,
    uniqueCountTableColumns,

    bySourceData,
    bySourceFilterParams,
    bySourceFilterValueOptions,
    bySourceIsDownloadListOpen,
    bySourceIsFilterOpen,
    bySourceOnApplyFilters,
    bySourceOnDownloadOptionClick,
    bySourceOnEmptyListLabel,
    bySourceOnExpandClick,
    bySourceOnFacetItemClick,
    bySourceOnFacetValueClick,
    bySourceOnFilterClick,
    bySourceOnFilterClose,
    bySourceOnFilterSearchChange,
    bySourceOnFooterTabClick,
    bySourceOnNewView,
    bySourceSelectedFacetValues,
    bySourceSelectedFooterTab,
    bySourceShowFilterFooter,
    bySourceTableColumns,

    byPublisherData,
    byPublisherFilterParams,
    byPublisherFilterValueOptions,
    byPublisherIsDownloadListOpen,
    byPublisherIsFilterOpen,
    byPublisherOnApplyFilters,
    byPublisherOnDownloadOptionClick,
    byPublisherOnEmptyListLabel,
    byPublisherOnExpandClick,
    byPublisherOnFacetItemClick,
    byPublisherOnFacetValueClick,
    byPublisherOnFilterClick,
    byPublisherOnFilterClose,
    byPublisherOnFilterSearchChange,
    byPublisherOnFooterTabClick,
    byPublisherOnNewView,
    byPublisherSelectedFacetValues,
    byPublisherSelectedFooterTab,
    byPublisherShowFilterFooter,
    byPublisherTableColumns,

    bySubjectData,
    bySubjectFilterParams,
    bySubjectFilterValueOptions,
    bySubjectIsDownloadListOpen,
    bySubjectIsFilterOpen,
    bySubjectOnApplyFilters,
    bySubjectOnDownloadOptionClick,
    bySubjectOnEmptyListLabel,
    bySubjectOnExpandClick,
    bySubjectOnFacetItemClick,
    bySubjectOnFacetValueClick,
    bySubjectOnFilterClick,
    bySubjectOnFilterClose,
    bySubjectOnFilterSearchChange,
    bySubjectOnFooterTabClick,
    bySubjectOnNewView,
    bySubjectSelectedFacetValues,
    bySubjectSelectedFooterTab,
    bySubjectShowFilterFooter,
    bySubjectTableColumns,

    overTimeData,
    overTimeFilterParams,
    overTimeFilterValueOptions,
    overTimeIsDownloadListOpen,
    overTimeIsFilterOpen,
    overTimeOnApplyFilters,
    overTimeOnDownloadOptionClick,
    overTimeOnEmptyListLabel,
    overTimeOnExpandClick,
    overTimeOnFacetItemClick,
    overTimeOnFacetValueClick,
    overTimeOnFilterClick,
    overTimeOnFilterClose,
    overTimeOnFilterSearchChange,
    overTimeOnFooterTabClick,
    overTimeOnNewView,
    overTimeSelectedFacetValues,
    overTimeSelectedFooterTab,
    overTimeShowFilterFooter,
    overTimeTableColumns,
  } = props

  return (
    <DashboardWrapper>
      <Header currentPath={currentPath} links={headerLinks} />
      <VisualisationRow>
        {/* <VisualisationWrapper> */}
        <CitationCountsOverTime
          data={overTimeData}
          filterParams={overTimeFilterParams}
          filterValueOptions={overTimeFilterValueOptions}
          isDownloadListOpen={overTimeIsDownloadListOpen}
          isFilterOpen={overTimeIsFilterOpen}
          onApplyFilters={overTimeOnApplyFilters}
          onDownloadOptionClick={overTimeOnDownloadOptionClick}
          onEmptyListLabel={overTimeOnEmptyListLabel}
          onExpandClick={overTimeOnExpandClick}
          onFacetItemClick={overTimeOnFacetItemClick}
          onFacetValueClick={overTimeOnFacetValueClick}
          onFilterClick={overTimeOnFilterClick}
          onFilterClose={overTimeOnFilterClose}
          onFilterSearchChange={overTimeOnFilterSearchChange}
          onFooterTabClick={overTimeOnFooterTabClick}
          onNewView={overTimeOnNewView}
          selectedFacetValues={overTimeSelectedFacetValues}
          selectedFooterTab={overTimeSelectedFooterTab}
          showFilterFooter={overTimeShowFilterFooter}
          tableColumns={overTimeTableColumns}
        />
        <CitationCountsBySubject
          data={bySubjectData}
          filterParams={bySubjectFilterParams}
          filterValueOptions={bySubjectFilterValueOptions}
          isDownloadListOpen={bySubjectIsDownloadListOpen}
          isFilterOpen={bySubjectIsFilterOpen}
          onApplyFilters={bySubjectOnApplyFilters}
          onDownloadOptionClick={bySubjectOnDownloadOptionClick}
          onEmptyListLabel={bySubjectOnEmptyListLabel}
          onExpandClick={bySubjectOnExpandClick}
          onFacetItemClick={bySubjectOnFacetItemClick}
          onFacetValueClick={bySubjectOnFacetValueClick}
          onFilterClick={bySubjectOnFilterClick}
          onFilterClose={bySubjectOnFilterClose}
          onFilterSearchChange={bySubjectOnFilterSearchChange}
          onFooterTabClick={bySubjectOnFooterTabClick}
          onNewView={bySubjectOnNewView}
          selectedFacetValues={bySubjectSelectedFacetValues}
          selectedFooterTab={bySubjectSelectedFooterTab}
          showFilterFooter={bySubjectShowFilterFooter}
          tableColumns={bySubjectTableColumns}
        />
        {/* </VisualisationWrapper> */}
      </VisualisationRow>

      <VisualisationRow>
        {/* <VisualisationWrapper> */}
        <CitationCountsByPublisher
          data={byPublisherData}
          filterParams={byPublisherFilterParams}
          filterValueOptions={byPublisherFilterValueOptions}
          isDownloadListOpen={byPublisherIsDownloadListOpen}
          isFilterOpen={byPublisherIsFilterOpen}
          onApplyFilters={byPublisherOnApplyFilters}
          onDownloadOptionClick={byPublisherOnDownloadOptionClick}
          onEmptyListLabel={byPublisherOnEmptyListLabel}
          onExpandClick={byPublisherOnExpandClick}
          onFacetItemClick={byPublisherOnFacetItemClick}
          onFacetValueClick={byPublisherOnFacetValueClick}
          onFilterClick={byPublisherOnFilterClick}
          onFilterClose={byPublisherOnFilterClose}
          onFilterSearchChange={byPublisherOnFilterSearchChange}
          onFooterTabClick={byPublisherOnFooterTabClick}
          onNewView={byPublisherOnNewView}
          selectedFacetValues={byPublisherSelectedFacetValues}
          selectedFooterTab={byPublisherSelectedFooterTab}
          showFilterFooter={byPublisherShowFilterFooter}
          tableColumns={byPublisherTableColumns}
        />
        <CitationCountsBySource
          data={bySourceData}
          filterParams={bySourceFilterParams}
          filterValueOptions={bySourceFilterValueOptions}
          isDownloadListOpen={bySourceIsDownloadListOpen}
          isFilterOpen={bySourceIsFilterOpen}
          onApplyFilters={bySourceOnApplyFilters}
          onDownloadOptionClick={bySourceOnDownloadOptionClick}
          onEmptyListLabel={bySourceOnEmptyListLabel}
          onExpandClick={bySourceOnExpandClick}
          onFacetItemClick={bySourceOnFacetItemClick}
          onFacetValueClick={bySourceOnFacetValueClick}
          onFilterClick={bySourceOnFilterClick}
          onFilterClose={bySourceOnFilterClose}
          onFilterSearchChange={bySourceOnFilterSearchChange}
          onFooterTabClick={bySourceOnFooterTabClick}
          onNewView={bySourceOnNewView}
          selectedFacetValues={bySourceSelectedFacetValues}
          selectedFooterTab={bySourceSelectedFooterTab}
          showFilterFooter={bySourceShowFilterFooter}
          tableColumns={bySourceTableColumns}
        />
        {/* </VisualisationWrapper> */}
      </VisualisationRow>
      <VisualisationRow>
        {/* <VisualisationWrapper> */}
        <UniqueCitationCounts
          data={uniqueCountData}
          isDownloadListOpen={uniqueCountIsDownloadListOpen}
          onDownloadOptionClick={uniqueCountOnDownloadOptionClick}
          onExpandClick={uniqueCountOnExpandClick}
          onFooterTabClick={uniqueCountOnFooterTabClick}
          selectedFooterTab={uniqueCountSelectedFooterTab}
          tableColumns={uniqueCountTableColumns}
        />
        <CitationCorpusGrowth
          data={corpusGrowthData}
          isDownloadListOpen={corpusGrowthIsDownloadListOpen}
          onDownloadOptionClick={corpusGrowthOnDownloadOptionClick}
          onExpandClick={corpusGrowthOnExpandClick}
          onFooterTabClick={corpusGrowthOnFooterTabClick}
          onNewView={corpusGrowthOnNewView}
          selectedFooterTab={corpusGrowthSelectedFooterTab}
          tableColumns={corpusGrowthTableColumns}
        />
        {/* </VisualisationWrapper> */}
      </VisualisationRow>
      <Footer footerLinks={footerLinks} />
    </DashboardWrapper>
  )
}

Dashboard.propTypes = {
  currentPath: PropTypes.string,
  footerLinks: PropTypes.shape({
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
  }).isRequired,
  headerLinks: PropTypes.shape({
    homepage: PropTypes.string,
    dashboard: PropTypes.string,
  }).isRequired,

  overTimeData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  overTimeFilterParams: PropTypes.arrayOf(
    PropTypes.shape({
      isFacetSelected: PropTypes.bool.isRequired,
      type: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  overTimeFilterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  overTimeIsFilterOpen: PropTypes.bool.isRequired,
  overTimeIsDownloadListOpen: PropTypes.bool.isRequired,
  overTimeOnApplyFilters: PropTypes.func.isRequired,
  overTimeOnDownloadOptionClick: PropTypes.func.isRequired,
  overTimeOnEmptyListLabel: PropTypes.string.isRequired,
  overTimeOnExpandClick: PropTypes.func.isRequired,
  overTimeOnFacetItemClick: PropTypes.func.isRequired,
  overTimeOnFacetValueClick: PropTypes.func.isRequired,
  overTimeOnFilterClick: PropTypes.func.isRequired,
  overTimeOnFilterClose: PropTypes.func.isRequired,
  overTimeOnFilterSearchChange: PropTypes.func.isRequired,
  overTimeOnFooterTabClick: PropTypes.func.isRequired,
  overTimeOnNewView: PropTypes.func.isRequired,
  overTimeSelectedFooterTab: PropTypes.string.isRequired,
  overTimeSelectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  overTimeShowFilterFooter: PropTypes.bool.isRequired,
  overTimeTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,

  bySubjectData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  bySubjectFilterParams: PropTypes.arrayOf(
    PropTypes.shape({
      isFacetSelected: PropTypes.bool.isRequired,
      type: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  bySubjectFilterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  bySubjectIsFilterOpen: PropTypes.bool.isRequired,
  bySubjectIsDownloadListOpen: PropTypes.bool.isRequired,
  bySubjectOnApplyFilters: PropTypes.func.isRequired,
  bySubjectOnDownloadOptionClick: PropTypes.func.isRequired,
  bySubjectOnEmptyListLabel: PropTypes.string.isRequired,
  bySubjectOnExpandClick: PropTypes.func.isRequired,
  bySubjectOnFacetItemClick: PropTypes.func.isRequired,
  bySubjectOnFacetValueClick: PropTypes.func.isRequired,
  bySubjectOnFilterClick: PropTypes.func.isRequired,
  bySubjectOnFilterClose: PropTypes.func.isRequired,
  bySubjectOnFilterSearchChange: PropTypes.func.isRequired,
  bySubjectOnFooterTabClick: PropTypes.func.isRequired,
  bySubjectOnNewView: PropTypes.func.isRequired,
  bySubjectSelectedFooterTab: PropTypes.string.isRequired,
  bySubjectSelectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  bySubjectShowFilterFooter: PropTypes.bool.isRequired,
  bySubjectTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,

  byPublisherData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  byPublisherFilterParams: PropTypes.arrayOf(
    PropTypes.shape({
      isFacetSelected: PropTypes.bool.isRequired,
      type: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  byPublisherFilterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  byPublisherIsFilterOpen: PropTypes.bool.isRequired,
  byPublisherIsDownloadListOpen: PropTypes.bool.isRequired,
  byPublisherOnApplyFilters: PropTypes.func.isRequired,
  byPublisherOnDownloadOptionClick: PropTypes.func.isRequired,
  byPublisherOnEmptyListLabel: PropTypes.string.isRequired,
  byPublisherOnExpandClick: PropTypes.func.isRequired,
  byPublisherOnFacetItemClick: PropTypes.func.isRequired,
  byPublisherOnFacetValueClick: PropTypes.func.isRequired,
  byPublisherOnFilterClick: PropTypes.func.isRequired,
  byPublisherOnFilterClose: PropTypes.func.isRequired,
  byPublisherOnFilterSearchChange: PropTypes.func.isRequired,
  byPublisherOnFooterTabClick: PropTypes.func.isRequired,
  byPublisherOnNewView: PropTypes.func.isRequired,
  byPublisherSelectedFooterTab: PropTypes.string.isRequired,
  byPublisherSelectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  byPublisherShowFilterFooter: PropTypes.bool.isRequired,
  byPublisherTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,

  bySourceData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  bySourceFilterParams: PropTypes.arrayOf(
    PropTypes.shape({
      isFacetSelected: PropTypes.bool.isRequired,
      type: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  bySourceFilterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  bySourceIsDownloadListOpen: PropTypes.bool.isRequired,
  bySourceIsFilterOpen: PropTypes.bool.isRequired,
  bySourceOnApplyFilters: PropTypes.func.isRequired,
  bySourceOnDownloadOptionClick: PropTypes.func.isRequired,
  bySourceOnEmptyListLabel: PropTypes.string.isRequired,
  bySourceOnExpandClick: PropTypes.func.isRequired,
  bySourceOnFacetItemClick: PropTypes.func.isRequired,
  bySourceOnFacetValueClick: PropTypes.func.isRequired,
  bySourceOnFilterClick: PropTypes.func.isRequired,
  bySourceOnFilterClose: PropTypes.func.isRequired,
  bySourceOnFilterSearchChange: PropTypes.func.isRequired,
  bySourceOnFooterTabClick: PropTypes.func.isRequired,
  bySourceOnNewView: PropTypes.func.isRequired,
  bySourceSelectedFooterTab: PropTypes.string.isRequired,
  bySourceSelectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  bySourceShowFilterFooter: PropTypes.bool.isRequired,
  bySourceTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,

  uniqueCountData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  uniqueCountIsDownloadListOpen: PropTypes.bool.isRequired,
  uniqueCountOnDownloadOptionClick: PropTypes.func.isRequired,
  uniqueCountOnExpandClick: PropTypes.func.isRequired,
  uniqueCountOnFooterTabClick: PropTypes.func.isRequired,
  uniqueCountSelectedFooterTab: PropTypes.string.isRequired,
  uniqueCountTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,

  corpusGrowthData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  corpusGrowthIsDownloadListOpen: PropTypes.bool.isRequired,
  corpusGrowthOnDownloadOptionClick: PropTypes.func.isRequired,
  corpusGrowthOnExpandClick: PropTypes.func.isRequired,
  corpusGrowthOnFooterTabClick: PropTypes.func.isRequired,
  corpusGrowthSelectedFooterTab: PropTypes.string.isRequired,
  corpusGrowthOnNewView: PropTypes.func.isRequired,
  corpusGrowthTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

Dashboard.defaultProps = {
  currentPath: '/dashboard',
}

export default Dashboard
