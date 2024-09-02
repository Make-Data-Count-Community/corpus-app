import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { th, grid } from '@coko/client'

import { Footer } from '../common'

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
  gap: ${grid(4)};
  margin: ${grid(4)};
  max-width: 100%;
  overflow: hidden;
  padding: ${grid(0)};

  @media screen and (max-width: ${th('mediaQueries.medium')}) {
    flex-direction: column;
  }
`

const Dashboard = props => {
  const {
    footerLinks,

    corpusGrowthData,
    corpusGrowthIsDownloadListOpen,
    corpusGrowthLoading,
    corpusGrowthOnDownloadOptionClick,
    corpusGrowthOnFooterTabClick,
    corpusGrowthOnNewView,
    corpusGrowthSelectedFooterTab,
    corpusGrowthShowExpandButton,
    corpusGrowthTableColumns,

    uniqueCountData,
    uniqueCountIsDownloadListOpen,
    uniqueCountLoading,
    uniqueCountOnDownloadOptionClick,
    uniqueCountOnFooterTabClick,
    uniqueCountSelectedFooterTab,
    uniqueCountShowExpandButton,
    uniqueCountTableColumns,

    bySourceData,
    bySourceFilterParams,
    bySourceFilterValueOptions,
    bySourceIsDownloadListOpen,
    bySourceIsFilterOpen,
    bySourceLoading,
    bySourceOnApplyFilters,
    bySourceOnClearFilters,
    bySourceOnDownloadOptionClick,
    bySourceOnEmptyListLabel,
    bySourceOnFacetItemClick,
    bySourceOnFacetValueClick,
    bySourceOnFilterClick,
    bySourceOnFilterClose,
    bySourceOnFilterSearchChange,
    bySourceOnFooterTabClick,
    bySourceOnNewView,
    bySourceSelectedFacetCount,
    bySourceSelectedFacetValues,
    bySourceSelectedFooterTab,
    bySourceShowExpandButton,
    bySourceShowApplyFilterButton,
    bySourceShowClearFilterButton,
    bySourceTableColumns,

    byPublisherData,
    byPublisherFilterParams,
    byPublisherFilterValueOptions,
    byPublisherIsDownloadListOpen,
    byPublisherIsFilterOpen,
    byPublisherLoading,
    byPublisherOnApplyFilters,
    byPublisherOnClearFilters,
    byPublisherOnDownloadOptionClick,
    byPublisherOnEmptyListLabel,
    byPublisherOnFacetItemClick,
    byPublisherOnFacetValueClick,
    byPublisherOnFilterClick,
    byPublisherOnFilterClose,
    byPublisherOnFilterSearchChange,
    byPublisherOnFooterTabClick,
    byPublisherOnNewView,
    byPublisherSelectedFacetCount,
    byPublisherSelectedFacetValues,
    byPublisherSelectedFooterTab,
    byPublisherShowExpandButton,
    byPublisherShowApplyFilterButton,
    byPublisherShowClearFilterButton,
    byPublisherTableColumns,

    bySubjectData,
    bySubjectFilterParams,
    bySubjectFilterValueOptions,
    bySubjectIsDownloadListOpen,
    bySubjectIsFilterOpen,
    bySubjectLoading,
    bySubjectOnApplyFilters,
    bySubjectOnClearFilters,
    bySubjectOnDownloadOptionClick,
    bySubjectOnEmptyListLabel,
    bySubjectOnFacetItemClick,
    bySubjectOnFacetValueClick,
    bySubjectOnFilterClick,
    bySubjectOnFilterClose,
    bySubjectOnFilterSearchChange,
    bySubjectOnFooterTabClick,
    bySubjectOnNewView,
    bySubjectSelectedFacetCount,
    bySubjectSelectedFacetValues,
    bySubjectSelectedFooterTab,
    bySubjectShowExpandButton,
    bySubjectShowApplyFilterButton,
    bySubjectShowClearFilterButton,
    bySubjectTableColumns,

    overTimeData,
    overTimeFilterParams,
    overTimeFilterValueOptions,
    overTimeIsDownloadListOpen,
    overTimeIsFilterOpen,
    overTimeLoading,
    overTimeOnApplyFilters,
    overTimeOnClearFilters,
    overTimeOnDownloadOptionClick,
    overTimeOnEmptyListLabel,
    overTimeOnFacetItemClick,
    overTimeOnFacetValueClick,
    overTimeOnFilterClick,
    overTimeOnFilterClose,
    overTimeOnFilterSearchChange,
    overTimeOnFooterTabClick,
    overTimeOnNewView,
    overTimeSelectedFacetCount,
    overTimeSelectedFacetValues,
    overTimeSelectedFooterTab,
    overTimeShowExpandButton,
    overTimeShowApplyFilterButton,
    overTimeShowClearFilterButton,
    overTimeTableColumns,
  } = props

  return (
    <DashboardWrapper>
      <VisualisationRow>
        <CitationCountsOverTime
          data={overTimeData}
          filterParams={overTimeFilterParams}
          filterValueOptions={overTimeFilterValueOptions}
          isDownloadListOpen={overTimeIsDownloadListOpen}
          isFilterOpen={overTimeIsFilterOpen}
          loading={overTimeLoading}
          onApplyFilters={overTimeOnApplyFilters}
          onClearFilters={overTimeOnClearFilters}
          onDownloadOptionClick={overTimeOnDownloadOptionClick}
          onEmptyListLabel={overTimeOnEmptyListLabel}
          onFacetItemClick={overTimeOnFacetItemClick}
          onFacetValueClick={overTimeOnFacetValueClick}
          onFilterClick={overTimeOnFilterClick}
          onFilterClose={overTimeOnFilterClose}
          onFilterSearchChange={overTimeOnFilterSearchChange}
          onFooterTabClick={overTimeOnFooterTabClick}
          onNewView={overTimeOnNewView}
          selectedFacetCount={overTimeSelectedFacetCount}
          selectedFacetValues={overTimeSelectedFacetValues}
          selectedFooterTab={overTimeSelectedFooterTab}
          showApplyFilterButton={overTimeShowApplyFilterButton}
          showClearFilterButton={overTimeShowClearFilterButton}
          showExpandButton={overTimeShowExpandButton}
          tableColumns={overTimeTableColumns}
        />
        <CitationCountsByPublisher
          data={byPublisherData}
          filterParams={byPublisherFilterParams}
          filterValueOptions={byPublisherFilterValueOptions}
          isDownloadListOpen={byPublisherIsDownloadListOpen}
          isFilterOpen={byPublisherIsFilterOpen}
          loading={byPublisherLoading}
          onApplyFilters={byPublisherOnApplyFilters}
          onClearFilters={byPublisherOnClearFilters}
          onDownloadOptionClick={byPublisherOnDownloadOptionClick}
          onEmptyListLabel={byPublisherOnEmptyListLabel}
          onFacetItemClick={byPublisherOnFacetItemClick}
          onFacetValueClick={byPublisherOnFacetValueClick}
          onFilterClick={byPublisherOnFilterClick}
          onFilterClose={byPublisherOnFilterClose}
          onFilterSearchChange={byPublisherOnFilterSearchChange}
          onFooterTabClick={byPublisherOnFooterTabClick}
          onNewView={byPublisherOnNewView}
          selectedFacetCount={byPublisherSelectedFacetCount}
          selectedFacetValues={byPublisherSelectedFacetValues}
          selectedFooterTab={byPublisherSelectedFooterTab}
          showApplyFilterButton={byPublisherShowApplyFilterButton}
          showClearFilterButton={byPublisherShowClearFilterButton}
          showExpandButton={byPublisherShowExpandButton}
          tableColumns={byPublisherTableColumns}
        />
      </VisualisationRow>

      <VisualisationRow>
        <UniqueCitationCounts
          data={uniqueCountData}
          isDownloadListOpen={uniqueCountIsDownloadListOpen}
          loading={uniqueCountLoading}
          onDownloadOptionClick={uniqueCountOnDownloadOptionClick}
          onFooterTabClick={uniqueCountOnFooterTabClick}
          selectedFooterTab={uniqueCountSelectedFooterTab}
          showExpandButton={uniqueCountShowExpandButton}
          tableColumns={uniqueCountTableColumns}
        />
        <CitationCountsBySubject
          data={bySubjectData}
          filterParams={bySubjectFilterParams}
          filterValueOptions={bySubjectFilterValueOptions}
          isDownloadListOpen={bySubjectIsDownloadListOpen}
          isFilterOpen={bySubjectIsFilterOpen}
          loading={bySubjectLoading}
          onApplyFilters={bySubjectOnApplyFilters}
          onClearFilters={bySubjectOnClearFilters}
          onDownloadOptionClick={bySubjectOnDownloadOptionClick}
          onEmptyListLabel={bySubjectOnEmptyListLabel}
          onFacetItemClick={bySubjectOnFacetItemClick}
          onFacetValueClick={bySubjectOnFacetValueClick}
          onFilterClick={bySubjectOnFilterClick}
          onFilterClose={bySubjectOnFilterClose}
          onFilterSearchChange={bySubjectOnFilterSearchChange}
          onFooterTabClick={bySubjectOnFooterTabClick}
          onNewView={bySubjectOnNewView}
          selectedFacetCount={bySubjectSelectedFacetCount}
          selectedFacetValues={bySubjectSelectedFacetValues}
          selectedFooterTab={bySubjectSelectedFooterTab}
          showApplyFilterButton={bySubjectShowApplyFilterButton}
          showClearFilterButton={bySubjectShowClearFilterButton}
          showExpandButton={bySubjectShowExpandButton}
          tableColumns={bySubjectTableColumns}
        />
      </VisualisationRow>
      <VisualisationRow>
        <CitationCountsBySource
          data={bySourceData}
          filterParams={bySourceFilterParams}
          filterValueOptions={bySourceFilterValueOptions}
          isDownloadListOpen={bySourceIsDownloadListOpen}
          isFilterOpen={bySourceIsFilterOpen}
          loading={bySourceLoading}
          onApplyFilters={bySourceOnApplyFilters}
          onClearFilters={bySourceOnClearFilters}
          onDownloadOptionClick={bySourceOnDownloadOptionClick}
          onEmptyListLabel={bySourceOnEmptyListLabel}
          onFacetItemClick={bySourceOnFacetItemClick}
          onFacetValueClick={bySourceOnFacetValueClick}
          onFilterClick={bySourceOnFilterClick}
          onFilterClose={bySourceOnFilterClose}
          onFilterSearchChange={bySourceOnFilterSearchChange}
          onFooterTabClick={bySourceOnFooterTabClick}
          onNewView={bySourceOnNewView}
          selectedFacetCount={bySourceSelectedFacetCount}
          selectedFacetValues={bySourceSelectedFacetValues}
          selectedFooterTab={bySourceSelectedFooterTab}
          showApplyFilterButton={bySourceShowApplyFilterButton}
          showClearFilterButton={bySourceShowClearFilterButton}
          showExpandButton={bySourceShowExpandButton}
          tableColumns={bySourceTableColumns}
        />
        <CitationCorpusGrowth
          data={corpusGrowthData}
          isDownloadListOpen={corpusGrowthIsDownloadListOpen}
          loading={corpusGrowthLoading}
          onDownloadOptionClick={corpusGrowthOnDownloadOptionClick}
          onFooterTabClick={corpusGrowthOnFooterTabClick}
          onNewView={corpusGrowthOnNewView}
          selectedFooterTab={corpusGrowthSelectedFooterTab}
          showExpandButton={corpusGrowthShowExpandButton}
          tableColumns={corpusGrowthTableColumns}
        />
      </VisualisationRow>
      <Footer links={footerLinks} />
    </DashboardWrapper>
  )
}

Dashboard.propTypes = {
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

  overTimeData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  overTimeFilterParams: PropTypes.arrayOf(
    PropTypes.shape({
      isFacetSelected: PropTypes.bool,
      type: PropTypes.string,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          value: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  overTimeFilterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  overTimeIsFilterOpen: PropTypes.bool.isRequired,
  overTimeIsDownloadListOpen: PropTypes.bool.isRequired,
  overTimeLoading: PropTypes.bool.isRequired,
  overTimeOnApplyFilters: PropTypes.func.isRequired,
  overTimeOnClearFilters: PropTypes.func.isRequired,
  overTimeOnDownloadOptionClick: PropTypes.func.isRequired,
  overTimeOnEmptyListLabel: PropTypes.string.isRequired,
  overTimeOnFacetItemClick: PropTypes.func.isRequired,
  overTimeOnFacetValueClick: PropTypes.func.isRequired,
  overTimeOnFilterClick: PropTypes.func.isRequired,
  overTimeOnFilterClose: PropTypes.func.isRequired,
  overTimeOnFilterSearchChange: PropTypes.func.isRequired,
  overTimeOnFooterTabClick: PropTypes.func.isRequired,
  overTimeOnNewView: PropTypes.func.isRequired,
  overTimeSelectedFacetCount: PropTypes.number.isRequired,
  overTimeSelectedFooterTab: PropTypes.string.isRequired,
  overTimeSelectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  overTimeShowExpandButton: PropTypes.bool.isRequired,
  overTimeShowApplyFilterButton: PropTypes.bool.isRequired,
  overTimeShowClearFilterButton: PropTypes.bool.isRequired,
  overTimeTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      dataIndex: PropTypes.string,
      key: PropTypes.string,
    }),
  ).isRequired,

  bySubjectData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  bySubjectFilterParams: PropTypes.arrayOf(
    PropTypes.shape({
      isFacetSelected: PropTypes.bool,
      type: PropTypes.string,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          value: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  bySubjectFilterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  bySubjectIsFilterOpen: PropTypes.bool.isRequired,
  bySubjectIsDownloadListOpen: PropTypes.bool.isRequired,
  bySubjectLoading: PropTypes.bool.isRequired,
  bySubjectOnApplyFilters: PropTypes.func.isRequired,
  bySubjectOnClearFilters: PropTypes.func.isRequired,
  bySubjectOnDownloadOptionClick: PropTypes.func.isRequired,
  bySubjectOnEmptyListLabel: PropTypes.string.isRequired,
  bySubjectOnFacetItemClick: PropTypes.func.isRequired,
  bySubjectOnFacetValueClick: PropTypes.func.isRequired,
  bySubjectOnFilterClick: PropTypes.func.isRequired,
  bySubjectOnFilterClose: PropTypes.func.isRequired,
  bySubjectOnFilterSearchChange: PropTypes.func.isRequired,
  bySubjectOnFooterTabClick: PropTypes.func.isRequired,
  bySubjectOnNewView: PropTypes.func.isRequired,
  bySubjectSelectedFacetCount: PropTypes.number.isRequired,
  bySubjectSelectedFooterTab: PropTypes.string.isRequired,
  bySubjectSelectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  bySubjectShowExpandButton: PropTypes.bool.isRequired,
  bySubjectShowApplyFilterButton: PropTypes.bool.isRequired,
  bySubjectShowClearFilterButton: PropTypes.bool.isRequired,
  bySubjectTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      dataIndex: PropTypes.string,
      key: PropTypes.string,
    }),
  ).isRequired,

  byPublisherData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  byPublisherFilterParams: PropTypes.arrayOf(
    PropTypes.shape({
      isFacetSelected: PropTypes.bool,
      type: PropTypes.string,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          value: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  byPublisherFilterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  byPublisherIsFilterOpen: PropTypes.bool.isRequired,
  byPublisherIsDownloadListOpen: PropTypes.bool.isRequired,
  byPublisherLoading: PropTypes.bool.isRequired,
  byPublisherOnApplyFilters: PropTypes.func.isRequired,
  byPublisherOnClearFilters: PropTypes.func.isRequired,
  byPublisherOnDownloadOptionClick: PropTypes.func.isRequired,
  byPublisherOnEmptyListLabel: PropTypes.string.isRequired,
  byPublisherOnFacetItemClick: PropTypes.func.isRequired,
  byPublisherOnFacetValueClick: PropTypes.func.isRequired,
  byPublisherOnFilterClick: PropTypes.func.isRequired,
  byPublisherOnFilterClose: PropTypes.func.isRequired,
  byPublisherOnFilterSearchChange: PropTypes.func.isRequired,
  byPublisherOnFooterTabClick: PropTypes.func.isRequired,
  byPublisherOnNewView: PropTypes.func.isRequired,
  byPublisherSelectedFacetCount: PropTypes.number.isRequired,
  byPublisherSelectedFooterTab: PropTypes.string.isRequired,
  byPublisherSelectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  byPublisherShowExpandButton: PropTypes.bool.isRequired,
  byPublisherShowApplyFilterButton: PropTypes.bool.isRequired,
  byPublisherShowClearFilterButton: PropTypes.bool.isRequired,
  byPublisherTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      dataIndex: PropTypes.string,
      key: PropTypes.string,
    }),
  ).isRequired,

  bySourceData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  bySourceFilterParams: PropTypes.arrayOf(
    PropTypes.shape({
      isFacetSelected: PropTypes.bool,
      type: PropTypes.string,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          value: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  bySourceFilterValueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  bySourceIsDownloadListOpen: PropTypes.bool.isRequired,
  bySourceIsFilterOpen: PropTypes.bool.isRequired,
  bySourceLoading: PropTypes.bool.isRequired,
  bySourceOnApplyFilters: PropTypes.func.isRequired,
  bySourceOnClearFilters: PropTypes.func.isRequired,
  bySourceOnDownloadOptionClick: PropTypes.func.isRequired,
  bySourceOnEmptyListLabel: PropTypes.string.isRequired,
  bySourceOnFacetItemClick: PropTypes.func.isRequired,
  bySourceOnFacetValueClick: PropTypes.func.isRequired,
  bySourceOnFilterClick: PropTypes.func.isRequired,
  bySourceOnFilterClose: PropTypes.func.isRequired,
  bySourceOnFilterSearchChange: PropTypes.func.isRequired,
  bySourceOnFooterTabClick: PropTypes.func.isRequired,
  bySourceOnNewView: PropTypes.func.isRequired,
  bySourceSelectedFacetCount: PropTypes.number.isRequired,
  bySourceSelectedFooterTab: PropTypes.string.isRequired,
  bySourceSelectedFacetValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  bySourceShowExpandButton: PropTypes.bool.isRequired,
  bySourceShowApplyFilterButton: PropTypes.bool.isRequired,
  bySourceShowClearFilterButton: PropTypes.bool.isRequired,
  bySourceTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      dataIndex: PropTypes.string,
      key: PropTypes.string,
    }),
  ).isRequired,

  uniqueCountData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  uniqueCountIsDownloadListOpen: PropTypes.bool.isRequired,
  uniqueCountLoading: PropTypes.bool.isRequired,
  uniqueCountOnDownloadOptionClick: PropTypes.func.isRequired,
  uniqueCountOnFooterTabClick: PropTypes.func.isRequired,
  uniqueCountSelectedFooterTab: PropTypes.string.isRequired,
  uniqueCountShowExpandButton: PropTypes.bool.isRequired,
  uniqueCountTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      dataIndex: PropTypes.string,
      key: PropTypes.string,
    }),
  ).isRequired,

  corpusGrowthData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  corpusGrowthIsDownloadListOpen: PropTypes.bool.isRequired,
  corpusGrowthLoading: PropTypes.bool.isRequired,
  corpusGrowthOnDownloadOptionClick: PropTypes.func.isRequired,
  corpusGrowthOnFooterTabClick: PropTypes.func.isRequired,
  corpusGrowthSelectedFooterTab: PropTypes.string.isRequired,
  corpusGrowthShowExpandButton: PropTypes.bool.isRequired,
  corpusGrowthOnNewView: PropTypes.func.isRequired,
  corpusGrowthTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      dataIndex: PropTypes.string,
      key: PropTypes.string,
    }),
  ).isRequired,
}

export default Dashboard
