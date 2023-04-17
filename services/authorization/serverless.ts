import { Serverless } from 'serverless/aws';

import basicAuthorizer from '@functions/basic-authorizer';

const environment = {
  AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
  NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
  REGION: 'us-east-1',
  NODE_ENV: 'production',
}

const serverlessConfiguration: Serverless = {
  service: 'authorizer',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'Admin',
    httpApi: {
      cors: true, 
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment,
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
  functions: { basicAuthorizer },
  resources: {
    Resources: {},
    Outputs: {
      AuthorizerArn: {
        Value: { "Fn::GetAtt": ["BasicAuthorizerLambdaFunction", "Arn"] },
        Export: {
          Name: 'test'
        }
      }
    },
  },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
