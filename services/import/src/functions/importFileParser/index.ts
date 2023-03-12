import { handlerPath } from '@libs/handler-resolver';
import { AwsFunctionHandler } from 'serverless/aws';

const handlerConfig: AwsFunctionHandler = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'shop-training-serverless-import',
        event: 's3LObjectCreate:*',
        rules: [{ prefix: 'upload/' }],
        existing: true,
      },
    },
  ],
};

export default handlerConfig;
