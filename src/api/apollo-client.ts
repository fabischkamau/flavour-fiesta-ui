import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_MODUS_API_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${import.meta.env.VITE_MODUS_API_TOKEN}`,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
