// @flow
import Papa from 'papaparse';
import gql from 'graphql-tag';

import type { QueryParams } from 'influx-api';

// internal method exported just for tests
export const parseResults = (
  result: string,
  remap: { [string]: string },
  type: string,
) => {
  const response = result.trim();
  if (!response) {
    return null;
  }
  const results = Papa.parse(response, {
    header: true,
  });
  if (results.errors.length > 0) {
    throw new Error(JSON.stringify(results.errors));
  }
  // console.log(results);
  return results.data.map(entry => ({
    __typename: type,
    // TODO: this might be underperformant solution
    ...Object.keys(remap).reduce(
      (acc, key) => ({ ...acc, [key]: entry[remap[key]] }),
      {},
    ),
  }));
};

// internal method exported just for tests
export const queryBase = (cache: any, query: string): QueryParams<'csv'> => {
  const { form } = cache.readQuery({
    query: gql`
      {
        form {
          url
          u
          p
        }
      }
    `,
  });

  return {
    ...form,
    q: query,
    responseType: 'csv',
  };
};