import { StatusCodes } from "http-status-codes";
import { Client } from "pg";

import {dbOptions} from "../common/db-connect";

enum Table {
    Products = "products",
    Stocks = "stocks",
}

export const postProduct = async (title, description, price, count = 0) => {
    const client = new Client(dbOptions);
    try {
        await client.connect();
    } catch (err) {
        console.error("Error during db connection", err);
        client.end();
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error during db connection",
        };
    }

    try {
        await client.query("BEGIN");
        let query = {
            text: `INSERT INTO ${Table.Products}(title, description, price) VALUES ($1, $2, $3) RETURNING id;`,
            values: [title, description, price],
        };

        const id = await client.query(query);

        query = {
            text: `INSERT INTO ${Table.Stocks}(product_id, count) VALUES ($1, $2)`,
            values: [id.rows[0].id, count],
        };

        await client.query(query);

        await client.query("COMMIT");

        return {
            status: StatusCodes.OK,
            message: {
                productId: id,
                title: title,
                description: description,
                price: price,
                count: count,
            },
        };
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error during INSERT", err);
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error during INSERT",
        };
    } finally {
        client.end();
    }
};
