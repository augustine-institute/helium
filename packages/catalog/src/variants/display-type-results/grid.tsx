import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalTypes, formatTime } from '@thoughtindustries/content';
import { CatalogState } from '../../core';
import { CatalogResultItem, CatalogResultsProps } from '../../types';
import ItemLinkWrapper from './item-link-wrapper';
import ItemAssetBlock from './item-asset-block';
import ItemQueueButton from './item-queue-button';
import ItemRibbon from './item-ribbon';
import { priceFormat, limitText } from './utilities';

type DisplayTypeResultsGridProps = Pick<CatalogResultsProps, 'onClick' | 'onAddedToQueue'> &
  Pick<CatalogState, 'displayAuthorsEnabled' | 'displayStartDateEnabled' | 'displayBundle'> & {
    items: CatalogResultItem[];
  };

type DisplayTypeResultsGridItemProps = Omit<DisplayTypeResultsGridProps, 'items'> & {
  item: CatalogResultItem;
};

const ItemCompletedBlock = () => {
  const { t } = useTranslation();
  return (
    <div className="block absolute h-full left-0 top-0 w-full text-center bg-white bg-opacity-80 z-1">
      <div className="absolute w-full top-1/2 transform -translate-y-1/2">
        <div>
          <i
            className="bg-white text-3xl inline-block p-4 rounded-full border-4 border-solid border-white border-opacity-50 my-0 mx-auto bg-clip-padding"
            aria-label="Completed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="#5bb65c"
            >
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
            </svg>
          </i>
        </div>
        <p className="mt-1 text-base">{t('course-completed-decal')}</p>
      </div>
    </div>
  );
};

const ItemTitleBlock = ({
  title,
  courseStartDate,
  timeZone
}: {
  title: string;
  courseStartDate?: string;
  timeZone?: string;
}) => (
  <p className="mb-1">
    {title}
    {courseStartDate && (
      <>
        <br />
        <span className="text-xs text-gray-700">
          {formatTime(courseStartDate, timeZone, 'MM/DD/YYYY')}
        </span>
      </>
    )}
  </p>
);

const ItemSourceBlock = ({
  contentTypeLabel,
  source
}: {
  contentTypeLabel?: string;
  source?: string;
}) => (
  <div className="text-xs text-gray-700">
    {contentTypeLabel && <strong>{contentTypeLabel}</strong>}
    {contentTypeLabel && source && <>|{source}</>}
    {!contentTypeLabel && source && <strong>{source}</strong>}
  </div>
);

// TODO: might consider extracting as common component
const Star = ({ marked }: { marked: boolean }) => (
  <span className="text-accent">{marked ? '\u2605' : '\u2606'}</span>
);
const Stars = ({ gradePercentage }: { gradePercentage: number }) => {
  let stars: number;

  stars = gradePercentage * 0.05;
  const remainder = stars % 0.5;

  if (remainder > 0) {
    stars = stars - remainder + 0.5;
  }

  return (
    <div>
      {Array.from({ length: 5 }, (v, i) => (
        <Star key={`star-${i}`} marked={stars > i} />
      ))}
    </div>
  );
};

const ItemCtaBlock = ({
  isActive,
  callToAction
}: {
  isActive?: boolean;
  callToAction?: string;
}) => {
  if (isActive) {
    return (
      <span className="border-none rounded-sm cursor-pointer inline-block text-sm font-normal leading-normal m-0 p-0 relative text-center no-underline transition-colors ease-in-out duration-200 text-accent float-right text-left h-auto hover:text-accent">
        {callToAction}
      </span>
    );
  }

  return <span className="text-xs">{callToAction}</span>;
};

const ItemPriceBlock = ({
  priceInCents,
  hasAvailability,
  suggestedRetailPriceInCents
}: {
  priceInCents?: number;
  hasAvailability?: boolean;
  suggestedRetailPriceInCents?: number;
}) => {
  if (hasAvailability) {
    return null;
  }

  return (
    <>
      {priceInCents && <span>{priceFormat(priceInCents)}</span>}
      {suggestedRetailPriceInCents && (
        <span className="line-through text-gray-700 text-xs">
          {priceFormat(suggestedRetailPriceInCents)}
        </span>
      )}
    </>
  );
};

const ItemBundleBlock = ({ priceInCents, annualPriceInCents, slug }: GlobalTypes.Bundle) => {
  const { t } = useTranslation();

  const linkProps = {
    className:
      'cursor-pointer relative font-normal font-secondary leading-none text-xs text-accent-contrast',
    href: `/bundle/${slug}`
  };

  // stylings
  const planCurrencyClassnames = 'font-bold text-sm';
  const planIntervalClassnames = 'text-xs';

  return (
    <div className="pt-1 px-4 pb-2 leading-none bg-accent text-accent-contrast">
      <small>{t('primary-bundle-intro')}</small>

      <div className="flex justify-between items-end">
        <div>
          {priceInCents && (
            <div>
              <span className={planCurrencyClassnames}>{priceFormat(priceInCents)}</span>
              <span className={planIntervalClassnames}>/ {t('course.per-month')}</span>
            </div>
          )}

          {annualPriceInCents && (
            <div>
              <span className={planCurrencyClassnames}>{priceFormat(annualPriceInCents)}</span>
              <span className={planIntervalClassnames}>/ {t('course.per-year')}</span>
            </div>
          )}
        </div>

        <a {...linkProps}>{t('bundle.learn-button')}</a>
      </div>
    </div>
  );
};

/**
 * TODO: similar UI layout as @thoughtindustries/featured-content - ContentTileStandardLayout.Item,
 * with small differences to how some component props are handled, like:
 * desktopColumnCount, various display options (displayAuthorsEnabled, etc),
 * and displayBundle. Might consider consolidating the components.
 */
const DisplayTypeResultsGridItem = ({
  onClick,
  onAddedToQueue,
  displayAuthorsEnabled,
  displayStartDateEnabled,
  displayBundle,
  item
}: DisplayTypeResultsGridItemProps): JSX.Element => {
  const {
    asset,
    title,
    description,
    isActive,
    ribbon,
    isCompleted,
    courseStartDate,
    contentTypeLabel,
    source,
    authors,
    rating,
    canAddToQueue,
    callToAction,
    priceInCents,
    hasAvailability,
    suggestedRetailPriceInCents,
    availabilityStatus,
    timeZone
  } = item;

  // derived values
  const displayAuthors = displayAuthorsEnabled && authors?.length ? authors.join(', ') : null;
  const displayCourseStartDate = displayStartDateEnabled ? courseStartDate : undefined;

  return (
    <li>
      <>
        <ItemLinkWrapper item={item} onClick={onClick}>
          <div className="grid grid-cols-1 border border-solid border-gray-300 relative">
            {ribbon && <ItemRibbon ribbon={ribbon} attached attachedClassnames="-top-1" />}
            <div className="relative">
              {isCompleted && <ItemCompletedBlock />}
              <ItemAssetBlock asset={asset} />
            </div>
            <div className="p-2.5">
              {title && (
                <ItemTitleBlock
                  title={title}
                  courseStartDate={displayCourseStartDate}
                  timeZone={timeZone}
                />
              )}
              <ItemSourceBlock contentTypeLabel={contentTypeLabel} source={source} />
              {displayAuthors && <p className="text-xs mb-1 text-gray-700">{displayAuthors}</p>}
              {description && (
                <p className="text-xs text-gray-700 pt-1 mb-0 overflow-hidden">
                  {limitText(description, 75)}
                </p>
              )}
              {rating && <Stars gradePercentage={rating} />}
              <hr className="my-3" />
              <div className="text-base leading-none">
                {canAddToQueue && (
                  <div className="flex flex-wrap-reverse justify-between items-end">
                    <span>
                      <ItemQueueButton item={item} onAddedToQueue={onAddedToQueue} />
                    </span>
                    <span>
                      <ItemCtaBlock isActive={isActive} callToAction={callToAction} />
                    </span>
                  </div>
                )}
                {!canAddToQueue && priceInCents && (
                  <>
                    <ItemPriceBlock
                      priceInCents={priceInCents}
                      hasAvailability={hasAvailability}
                      suggestedRetailPriceInCents={suggestedRetailPriceInCents}
                    />
                    <ItemCtaBlock isActive callToAction={callToAction} />
                  </>
                )}
                {!canAddToQueue && !priceInCents && (
                  <ItemCtaBlock isActive={isActive} callToAction={callToAction} />
                )}
              </div>
            </div>
          </div>
        </ItemLinkWrapper>
        {displayBundle && !availabilityStatus && <ItemBundleBlock {...displayBundle} />}
      </>
    </li>
  );
};

const DisplayTypeResultsGrid = ({
  items,
  ...restProps
}: DisplayTypeResultsGridProps): JSX.Element => {
  const contentItems = items
    .filter(({ isNotCompleted }) => !isNotCompleted)
    .map((item, index) => (
      <DisplayTypeResultsGridItem key={`result-item-${index}`} item={item} {...restProps} />
    ));
  return <ul className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">{contentItems}</ul>;
};

DisplayTypeResultsGrid.displayName = 'DisplayTypeResultsGrid';
export default DisplayTypeResultsGrid;
