import { Serverless } from 'serverless/aws';

import importProductsFile from '@functions/importProductsFile';

const s3Config = {
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
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          's3:GetObject',
          's3:PutObject',
          's3:GetObjectVersion',
        ],
        Resource: `arn:aws:s3:::${s3Config.bucketName}/*`,
      },
    ],
  },
  resources: {
    Resources: {
      ImportProductsS3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: s3Config.bucketName,
        }
      },
    }
  },
  functions: { importProductsFile },
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
