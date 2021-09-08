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
    const { description, title, sort, height, price, count } = event.body

    try {
        await client.connect();

        await client.query('BEGIN');
        const ifExists = await client.query(`select * from flowers where title = '${title}' and sort = '${sort}' and height = ${height} `);
        const existsProduct = ifExists.rows[0];
        if (existsProduct) throw new AppError('This product already exists', StatusCodes.BAD_REQUEST);

        await client.query(`insert into flowers values (default, '${description}', '${title}', '${sort}', ${height}, ${price})`);
        const { rows } = await client.query(`select id from flowers where title = '${title}' and sort='${sort}' and height=${height}`);
        const { id } = rows[0];
        await client.query(`insert into stock values ('${id}', ${count})`);

        const ifCreated = await client.query('select f.id, description, title, sort, height, price, count from flowers f join stock s on f.id = s.id where f.id = $1', [id]);
        await client.query('COMMIT');

        const newProduct = ifCreated.rows[0];
        return formatJSONResponse(newProduct, StatusCodes.CREATED);
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        await client.end();
    }
}

export const main = middyfy(createProduct);
