import { Client, cacheExchange, fetchExchange } from '@urql/core';

const url = import.meta.env.VITE_HYGRAPH_URL;
const token = import.meta.env.VITE_HYGRAPH_TOKEN_LOCKED;

if (!url || !token) {
  throw new Error('Missing Hygraph environment variables. Check your .env file.');
}

export const client = new Client({
  url: url as string,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  },
});




