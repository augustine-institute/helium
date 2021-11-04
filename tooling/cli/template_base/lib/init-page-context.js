const fetch = require('isomorphic-unfetch');
const { ApolloClient, InMemoryCache } = require('@apollo/client');
const { BatchHttpLink } = require('@apollo/client/link/batch-http');

module.exports = { initPageContext };

async function initPageContext(url, tiInstance, renderPage, currentUser, appearance) {
  const { apolloClient, heliumEndpoint } = makeApolloClient(tiInstance);
  const pageContextInit = {
    url,
    tiInstance,
    apolloClient,
    heliumEndpoint,
    appearance,
    currentUser
  };

  const pageContext = await renderPage(pageContextInit);

  return pageContext;
}

function makeApolloClient(tiInstance) {
  const heliumEndpoint = `${tiInstance.instanceUrl}/helium?apiKey=${tiInstance.apiKey}`;
  return {
    heliumEndpoint,
    apolloClient: new ApolloClient({
      ssrMode: true,
      link: new BatchHttpLink({
        uri: heliumEndpoint,
        fetch
      }),
      cache: new InMemoryCache()
    })
  };
}
