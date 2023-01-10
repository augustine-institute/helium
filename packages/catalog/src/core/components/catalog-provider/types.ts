import { CatalogParams } from '../../utilities/parse-catalog-data';
import { CatalogParsedURL, CatalogURLManager } from '../../utilities/manage-catalog-url';
import { ReactNode } from 'react';

export type CatalogContextType = {
  params: CatalogParams;
  urlManager: CatalogURLManager;
};

export type CatalogProviderConfig = {
  layoutId?: string;
  widgetId?: string;
  parsedUrl: CatalogParsedURL;
};

export type CatalogProviderProps = {
  config: CatalogProviderConfig;
  children: ReactNode;
};
