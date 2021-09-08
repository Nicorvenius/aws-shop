import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import { Client } from "pg"
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { validate } from 'uuid';

import { AppError } from '@libs/apiError';
import { product } from "../../types/product.type";
import { dbOptions } from 'src/common/db-connect';

export const findProduct = async (productsArray: product[], id: number): Promise<product | null> => {
  const productsList = await Promise.resolve(productsArray);
  return productsList.find(e => e.id == id);
}

export const getProductById = async (event) => {
  const client = new Client(dbOptions);
  const { productId } = event.pathParameters;

  if (!validate(productId)) {
    throw new AppError(getReasonPhrase(StatusCodes.BAD_REQUEST), StatusCodes.BAD_REQUEST);
  }

  try {
    await client.connect();
    const { rows } = await client.query('SELECT f.id, description, title, sort, height, price, count FROM flowers f join stock s on f.id = s.id WHERE f.id = $1', [productId]);
    const product = rows[0];
    if (!product) {
      throw new AppError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND);
    }
    return product;
  } finally {
    await client.end();
  }
}

export const main = middyfy(getProductById);
