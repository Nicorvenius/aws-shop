import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/getProductsById.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true
      }
    }
  ]
}
