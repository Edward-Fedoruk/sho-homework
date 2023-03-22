import { handlerPath } from '@libs/handler-resolver';
import { AwsFunctionHandler } from 'serverless/aws';

const handlerConfig: AwsFunctionHandler = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
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
