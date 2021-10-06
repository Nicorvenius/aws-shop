import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  useDotenv: true,
  configValidationMode: 'error',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: "eu-west-1",
    stage: "dev",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: [{ Ref: "createProductTopic" }],
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: {
          "Fn::GetAtt": ["catalogItemsQueue", "Arn"],
        },
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_DATABASE: "${env:PG_DB}",
      PG_USERNAME: "${env:PG_USER}",
      PG_PASSWORD: "${env:PG_PASSWORD}",
      FIRST_EMAIL: "${env:FIRST_EMAIL}",
      SECOND_EMAIL: "${env:SECOND_EMAIL}",
      SQS_URL: {
        Ref: "catalogItemsQueue",
      },
      SNS_ARN: {
        Ref: "createProductTopic",
      },
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "sqs-create-topic",
        },
      },
      createProductSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "${env:FIRST_EMAIL}",
          Protocol: "email",
          TopicArn: {
            Ref: "createProductTopic",
          },
          FilterPolicy: {
            price: [
              {
                numeric: ["<=", 5],
              },
            ],
          },
        },
      },
      expensiveProductSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "${env:SECOND_EMAIL}",
          Protocol: "email",
          TopicArn: {
            Ref: "createProductTopic",
          },
          FilterPolicy: {
            price: [
              {
                numeric: [">", 5],
              },
            ],
          },
        },
      },
    },
    Outputs: {
      catalogItemsQueue: {
        Value: {
          Ref: "catalogItemsQueue",
        },
        Export: {
          Name: "catalogItemsQueue",
        },
      },
      catalogItemsQueueArn: {
        Value: {
          "Fn::GetAtt": ["catalogItemsQueue", "Arn"],
        },
        Export: {
          Name: "catalogItemsQueueArn",
        },
      },
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById },
};

module.exports = serverlessConfiguration;
