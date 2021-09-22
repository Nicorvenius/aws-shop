export const {PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PASSWORD, PG_TIMEOUT} = process.env

export const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DB,
    user: PG_USER,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: PG_TIMEOUT,
}
