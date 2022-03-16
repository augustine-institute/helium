import React from 'react';
import { hydrateContent, GlobalTypes, HydratedContentItem } from '@thoughtindustries/content';
import { useTranslation } from 'react-i18next';
import { CatalogResultsState, useCatalogResults } from './core';
import { CatalogResultsProps } from './types';
import {
  DisplayTypeResultsList,
  DisplayTypeResultsGrid,
  DisplayTypeResultsCalendar
} from './variants/display-type-results';
import CatalogPagination from './catalog-pagination';

const DisplayTypeResults = ({
  activeDisplayType,
  hydratedResults,
  displayBundle,
  displayAuthorsEnabled,
  displayStartDateEnabled,
  displayDescriptionOnCalendar,
  companyTimeZone,
  onClick,
  onAddedToQueue
}: {
  activeDisplayType: GlobalTypes.ContentItemDisplayType;
  hydratedResults: HydratedContentItem[];
  displayBundle: CatalogResultsState['displayBundle'];
  displayAuthorsEnabled: CatalogResultsState['displayAuthorsEnabled'];
  displayStartDateEnabled: CatalogResultsState['displayStartDateEnabled'];
  displayDescriptionOnCalendar: CatalogResultsState['displayDescriptionOnCalendar'];
} & Omit<CatalogResultsProps, 'companyHasSessionLevelCustomFieldsFeature'>): JSX.Element => {
  const baseProps = {
    items: hydratedResults,
    onAddedToQueue
  };
  let props;
  switch (activeDisplayType) {
    case GlobalTypes.ContentItemDisplayType.List: {
      props = { ...baseProps, onClick, displayStartDateEnabled };
      return <DisplayTypeResultsList {...props} />;
    }
    case GlobalTypes.ContentItemDisplayType.Grid: {
      props = {
        ...baseProps,
        onClick,
        displayAuthorsEnabled,
        displayStartDateEnabled,
        displayBundle
      };
      return <DisplayTypeResultsGrid {...props} />;
    }
    case GlobalTypes.ContentItemDisplayType.Calendar: {
      props = { ...baseProps, displayDescriptionOnCalendar, companyTimeZone };
      return <DisplayTypeResultsCalendar {...props} />;
    }
    default: {
      const _exhaustiveCheck: never = activeDisplayType;
      return _exhaustiveCheck;
    }
  }
};

const CatalogResults = ({
  companyHasSessionLevelCustomFieldsFeature,
  companyTimeZone,
  onClick,
  onAddedToQueue
}: CatalogResultsProps): JSX.Element => {
  const {
    aggregations,
    aggregationFilters,
    displayType,
    resultsDisplayType,
    results,
    queryCustomFields,
    displayBundle,
    displayAuthorsEnabled,
    displayStartDateEnabled,
    displayDescriptionOnCalendar
  } = useCatalogResults();
  const { i18n, t } = useTranslation();

  // derived values
  /**
   * TODO: check if this description will be always undefined.
   * When aggregation filters are applied, do server respond with aggregations
   * different from the filters?
   */
  let activeFilterDescription;
  if (aggregationFilters.length) {
    const { label: filterLabel, value: filterValue } = aggregationFilters[0];
    aggregations.forEach(({ label, buckets = [] }) => {
      if (label === filterLabel) {
        buckets.forEach(({ value, description }) => {
          if (value === filterValue) {
            activeFilterDescription = description;
          }
        });
      }
    });
  }
  const activeDisplayType = displayType || resultsDisplayType;
  const hydrationCustomFields = companyHasSessionLevelCustomFieldsFeature ? queryCustomFields : {};
  const hydratedResults = results.map(result =>
    hydrateContent(i18n, result, companyTimeZone, hydrationCustomFields)
  );
  const hasResults = !!hydratedResults.length;

  // components
  const emptyResults = !hasResults && (
    <div className="bg-gray-100 text-gray-700 p-4 mb-4 rounded">{t('filter-no-courses')}</div>
  );
  // TODO: port over ti-editor-content
  const activeFilter = !!activeFilterDescription && (
    <>
      {activeFilterDescription}
      <hr />
    </>
  );
  const resultsProps = {
    hydratedResults,
    displayBundle,
    displayAuthorsEnabled,
    displayStartDateEnabled,
    displayDescriptionOnCalendar,
    companyTimeZone,
    onClick,
    onAddedToQueue
  };

  return (
    <>
      {activeFilter}
      {emptyResults}
      {hasResults && activeDisplayType && (
        <DisplayTypeResults {...resultsProps} activeDisplayType={activeDisplayType} />
      )}
      <CatalogPagination />
    </>
  );
};

CatalogResults.displayName = 'CatalogResults';
export default CatalogResults;
