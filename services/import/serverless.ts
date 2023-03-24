import { Serverless } from 'serverless/aws';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

export const s3Config = {
  bucketName: 'shop-training-serverless-import',
  folder: 'import'
}

const serverlessConfiguration: Serverless = {
  service: 'import',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'Admin',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: 'us-east-1',
      BUCKET: s3Config.bucketName,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:ListBucket'],
            Resource: `arn:aws:s3:::${s3Config.bucketName}`
          },
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: `arn:aws:s3:::${s3Config.bucketName}/*`
          },
          {
            Effect: "Allow",
            Action: [
              "logs:PutLogEvents",
              "logs:CreateLogGroup",
              "logs:CreateLogStream"
            ],
            Resource: `arn:aws:s3:::${s3Config.bucketName}/*`
          },
          {
            Effect: 'Allow',
            Action: [
              'sqs:*',
            ],
            Resource: `arn:aws:sqs:*:*:catalogItemsQueue`,
          },
        ]
      }
    },
  },
  resources: {
    Resources: {
      ImportProductsS3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: s3Config.bucketName,
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ['*'],
                AllowedMethods: [
                  'GET',
                  'PUT',
                  'POST',
                  'DELETE',
                  'HEAD',
                ],
                AllowedHeaders: ['Content-Type'],
                MaxAge: 3600
              }
            ]
          }
        }
      },
    }
  },
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
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
    s3: s3Config
  },
};

module.exports = serverlessConfiguration;
