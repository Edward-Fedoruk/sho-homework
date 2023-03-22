import type { ValidatedAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { S3 } from 'aws-sdk'

const s3 = new S3({ region: process.env.REGION })

const importProductsFile = async (event: ValidatedAPIGatewayProxyEvent<{}>) => {
  const { name } = event.queryStringParameters as Record<string, string | undefined>;

  console.log(`importing file ${name}`);

  const url = await s3.getSignedUrlPromise('putObject', {
    Bucket: process.env.BUCKET,
    Key: `uploaded/${name}`,
    Expires: 60000,
    ContentType: 'text/csv'
  })

  return formatJSONResponse({
    url
  });
};

export const main = importProductsFile;
