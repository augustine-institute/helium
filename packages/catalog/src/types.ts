import { SyntheticEvent } from 'react';
import { HydratedContentItem, GlobalTypes } from '@thoughtindustries/content';

export type CatalogResultItemRibbon = GlobalTypes.Ribbon;

export type CatalogResultItem = HydratedContentItem;

export interface CatalogResultsProps {
  /** company feature flag for content hydration */
  companyHasSessionLevelCustomFieldsFeature?: boolean;
  /** company property to override item timezone */
  companyTimeZone?: string;
  /** event handler for add to queue button */
  onAddedToQueue: (item: CatalogResultItem) => Promise<boolean | void>;
  /** optional event handler for result item */
  onClick?: (evt: SyntheticEvent, item: CatalogResultItem) => void;
}

export interface CatalogProps extends CatalogResultsProps {
  /** title that appears on top of the link lists */
  title?: string;
  /** display alternate title */
  alternateTitleDisplay?: boolean;
}
