import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import theme from '../theme';
import './_app.css'
import { WebSocketLink } from '@apollo/client/link/ws';
import {w3cwebsocket} from "websocket";
import {split,ApolloClient, HttpLink, InMemoryCache , ApolloProvider} from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { PaginatedPosts } from '../generated/graphql';
const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials : "include"
  })
const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/subscriptions`,
    options: {
      connectionCallback : () => {
        console.log("websocket run")
      },
      reconnect: true,
    },
    webSocketImpl : w3cwebsocket
  });
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink, 
    httpLink
  );
  const client = new ApolloClient({
    link : splitLink,
    credentials : "include",
    // headers: {
    //   cookie:
    //     (typeof window === "undefined"
    //       ? ctx?.req?.headers.cookie
    //       : undefined) || "",
    // },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
  })
function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme} >
          <CSSReset />
          <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default MyApp
