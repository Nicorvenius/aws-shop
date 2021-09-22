import 'source-map-support/register';
import { Client } from "pg"
import { middyfy } from '@libs/lambda';

import { dbOptions } from 'src/common/db-connect';
import { formatJSONResponse } from '@libs/apiGateway';

export const getProductsList = async () => {
  const client = new Client(dbOptions);
  try {
    await client.connect();
    const { rows } = await client.query('SELECT f.id, description, title, price, count FROM products f join stocks s on f.id = s.product_id');

    return formatJSONResponse(rows, 200);
  } finally {
    await client.end();
  }
}

export const main = middyfy(getProductsList);
