import { Serverless } from 'serverless/aws';

import products from '@functions/products';
import product from '@functions/product';
import createProduct from '@functions/create-product';
import catalogBatchProcess from '@functions/catalog-batch-process';

const environment = {
  AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
  NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
  PRODUCTS_TABLE_NAME: 'products',
  STOCKS_TABLE_NAME: 'stocks',
  REGION: 'us-east-1',
  NODE_ENV: 'production',
  CATALOG_QUEUE_NAME: 'catalogItemsQueue',
  TOPIC_NAME: 'createProductTopic',
  TOPIC_ARN: { "Ref": "CreateProductTopic" },
}

const serverlessConfiguration: Serverless = {
  service: 'server',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'Admin',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment,
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:BatchGetItem',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
          'dynamodb:Query',
          'dynamodb:Scan',
        ],
        Resource: 'arn:aws:dynamodb:*:*:*',
      },
      {
        Effect: 'Allow',
        Action: [
          'sqs:*',
        ],
        Resource: `arn:aws:sqs:*:*:${environment.CATALOG_QUEUE_NAME}`,
      },
      {
        Effect: 'Allow',
        Action: [
          'sns:*',
        ],
        Resource: { "Ref": "CreateProductTopic" },
      },
    ],
  },
  custom: {
    dynamodb: {
      stages: ['dev', 'prod'],
      start: {
        port: 8000,
        inMemory: true
      },
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  // import the function via paths
  functions: { products, product, createProduct, catalogBatchProcess },
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: environment.PRODUCTS_TABLE_NAME,
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' }
          ],
          KeySchema: [
            {AttributeName: 'id', KeyType: 'HASH' }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      },
      StocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: environment.STOCKS_TABLE_NAME,
          AttributeDefinitions: [
            { AttributeName: 'product_id', AttributeType: 'S' }
          ],
          KeySchema: [
            {AttributeName: 'product_id', KeyType: 'HASH' }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      },
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: environment.CATALOG_QUEUE_NAME,
        }
      },
      CreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        }
      },
      CreateProductTopicSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          Endpoint: 'ed.fedorukk@gmail.com',
          TopicArn: { "Ref": "CreateProductTopic" }
        }
      }
    }
  },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
