import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: { 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] },
        batchSize: 5,
      }
    }
  ]
};
