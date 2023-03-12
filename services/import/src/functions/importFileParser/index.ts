import { handlerPath } from '@libs/handler-resolver';
import { AwsFunctionHandler } from 'serverless/aws';

const handlerConfig: AwsFunctionHandler = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: process.env.BUCKET!,
        event: 's3LObjectCreate:*',
        rules: [{ prefix: 'upload/' }]
      },
    },
  ],
};

export default handlerConfig;
