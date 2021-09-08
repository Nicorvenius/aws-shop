import 'source-map-support/register';
import { Client } from "pg"
import { middyfy } from '@libs/lambda';

import { dbOptions } from 'src/common/db-connect';

export const getProductsList = async () => {
  const client = new Client(dbOptions);
  try {
    await client.connect();
    const { rows } = await client.query('SELECT f.id, description, title, sort, height, price, count FROM flowers f join stock s on f.id = s.id');
    const products = rows;
    return products;
  } finally {
    await client.end();
  }
}

export const main = middyfy(getProductsList);
