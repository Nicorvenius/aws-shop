import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/getProductsList.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true
      }
    }
  ]
}
