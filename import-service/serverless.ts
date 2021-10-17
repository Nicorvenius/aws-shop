import type { AWS } from "@serverless/typescript";

import importFileParser from "@functions/importFileParser";
import importProductsFile from "@functions/importProductsFile";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "2",
  useDotenv: true,
  configValidationMode: 'error',
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-west-1",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:ListBucket", "s3:PutObject", "s3:PutObjectAcl"],
        Resource: [
          "arn:aws:s3:::import-service-aws",
        ],
      },
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: [
          "arn:aws:s3:::import-service-aws/*",
        ],
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: { "Fn::ImportValue": "catalogItemsQueueArn" },
      },
    ],
    stage: "dev",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      SQS_URL: { "Fn::ImportValue": "catalogItemsQueue" },
    },
    lambdaHashingVersion: "20201221",
  },
  // import the function via paths
  functions: { importFileParser, importProductsFile },
};

module.exports = serverlessConfiguration;
