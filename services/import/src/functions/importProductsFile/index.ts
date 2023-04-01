import { handlerPath } from '@libs/handler-resolver';
import { AwsFunctionHandler } from 'serverless/aws';

const handlerConfig: AwsFunctionHandler = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        authorizer: {
          arn: 'arn:aws:lambda:us-east-1:567956171278:function:authorizer-dev-basicAuthorizer'
        },
        cors: true,
        request: {
          schemas: {},
          parameters: {
            querystrings: {
              name: true,
            }
          },
        },
      },
    },
  ],
};

export default handlerConfig;
