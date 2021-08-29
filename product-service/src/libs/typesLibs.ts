interface IHeaders {
    [key: string]: string
}

export const headers: IHeaders = {
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*'
}

export interface IResponse {
    statusCode: number,
    headers: IHeaders,
    body: string
}

export interface IRequest {
    [key: string]: unknown
}
