import { SyntheticEvent, ReactElement } from 'react';
import { HydratedContentItem, GlobalTypes } from '@thoughtindustries/content';

export type CatalogResultItemRibbon = GlobalTypes.Ribbon;

export type CatalogResultItem = HydratedContentItem;

export type PriceFormatFn = (priceInCents: number) => string;

export interface CatalogResultsProps {
  /** company feature flag for content hydration */
  companyHasSessionLevelCustomFieldsFeature?: boolean;
  /** company property to override item timezone */
  companyTimeZone?: string;
  /** event handler for add to queue button */
  onAddedToQueue: (item: CatalogResultItem) => Promise<boolean | void>;
  /** optional event handler for result item */
  onClick?: (evt: SyntheticEvent, item: CatalogResultItem) => void;
  /** optional function for prioritized price formatting */
  priceFormat?: PriceFormatFn;
  /** company property to format price */
  companyDefaultLocale?: string;
  /** currency code to format price */
  currencyCode?: string;
  /** specify number of items to return from catalog */
  numberOfContentItems?: number;
}

export type PaginationFnArgs = {
  page: number;
  pageSize: number;
  total: number;
  getPageLink: (page: number) => string;
};
export type PaginationFn = (args: PaginationFnArgs) => ReactElement;

export interface CatalogProps extends CatalogResultsProps {
  /** title that appears on top of the link lists */
  title?: string;
  /** display alternate title */
  alternateTitleDisplay?: boolean;
  /** optional view for pagination */
  pagination?: PaginationFn;
}
