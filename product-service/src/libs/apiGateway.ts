import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

import { headers, IResponse, IRequest } from './typesLibs'

export const apiResponses = {
  _200: (reqiest: IRequest, status: number): IResponse => {
    return {
      statusCode: status,
      headers,
      body: JSON.stringify(reqiest),
    };
  },
  _404: (reqiest: IRequest, status: number): IResponse => {
    return {
      statusCode: status,
      headers,
      body: JSON.stringify({ message: `Product with such Id ${reqiest.products} not found` }),
    };
  },
  _500: (reqiest: IRequest, status: number): IResponse => {
    return {
      statusCode: status,
      headers,
      body: JSON.stringify({ message: `Response ${reqiest.message}` }),
    };
  },
};

export const formatJSONResponse = (response: Record<string, unknown>, status: number) => {
  return apiResponses['_' + status](response, status);
}
