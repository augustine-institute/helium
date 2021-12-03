import ReactDOM from 'react-dom';
import React from 'react';
import { getPage } from 'vite-plugin-ssr/client';
import { PageWrapper } from './PageWrapper';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import 'virtual:windi.css';

hydrate();

async function hydrate() {
  // For Client Routing we should use `useClientRouter()` instead of `getPage()`.
  // See https://vite-plugin-ssr.com/useClientRouter
  const pageContext = await getPage();
  const {
    Page,
    pageProps,
    heliumEndpoint,
    apolloIntialState,
    appearance,
    currentUser,
    isProduction
  } = pageContext;
  const apolloClient = makeApolloClient(heliumEndpoint, apolloIntialState, isProduction);

  if (currentUser && currentUser.lang) {
    i18n.changeLanguage(currentUser.lang);
  }

  ReactDOM.hydrate(
    <ApolloProvider client={apolloClient}>
      <I18nextProvider i18n={i18n}>
        <PageWrapper pageContext={pageContext}>
          <Page {...pageProps} appearance={appearance} currentUser={currentUser} />
        </PageWrapper>
      </I18nextProvider>
    </ApolloProvider>,
    document.getElementById('page-view')
  );
}

function makeApolloClient(heliumEndpoint, apolloIntialState, isProduction) {
  let link = new BatchHttpLink({
    uri: heliumEndpoint
  });

  if (isProduction) {
    link = createPersistedQueryLink({ sha256 }).concat(link);
  }

  return new ApolloClient({
    link,
    cache: new InMemoryCache().restore(apolloIntialState)
  });
}
