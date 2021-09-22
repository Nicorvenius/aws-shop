import 'source-map-support/register';

import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { AppError } from '@libs/apiError';

import { Client } from 'pg';
import { StatusCodes } from 'http-status-codes';
import schema from './schema';
import { dbOptions } from '../../common/db-connect';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log('Incoming event into postProduct is:   ', event);
    const client = new Client(dbOptions);
    const { description, title, price, count } = event.body
    console.log(event.body)
    console.log(typeof event.body)

    try {
        await client.connect();

        await client.query('BEGIN');
        const ifExists = await client.query(`select * from products where title = '${title}'`);
        const existsProduct = ifExists.rows[0];
        if (existsProduct) throw new AppError('This product already exists', StatusCodes.BAD_REQUEST);

        await client.query(`insert into products values (default, '${title}', '${description}', ${price})`);
        const { rows } = await client.query(`select id from products where title = '${title}'`);
        const { id } = rows[0];
        await client.query(`insert into stocks values (default, '${id}', ${count})`);

        const ifCreated = await client.query('select f.id, description, title, price, count from products f join stocks s on f.id = s.product_id where f.id = $1', [id]);
        await client.query('COMMIT');

        const newProduct = ifCreated.rows[0];
        return formatJSONResponse(newProduct, StatusCodes.CREATED);
    } catch (err) {
        await client.query('ROLLBACK');
        return err;
    } finally {
        await client.end();
    }
}

export const main = middyfy(createProduct);
