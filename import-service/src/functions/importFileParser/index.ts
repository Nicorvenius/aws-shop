import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "import-service-aws",
        event: "s3:ObjectCreated:*",
        rules: [
          {
            prefix: "uploaded/"
          },
        ],
        existing: true,
      },
    },
  ],
};