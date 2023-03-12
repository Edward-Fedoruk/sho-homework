import type { ValidatedAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { S3 } from 'aws-sdk'

const s3 = new S3({ region: process.env.REGION })

const importProductsFile = async (event: ValidatedAPIGatewayProxyEvent<{}>) => {
  const { name } = event.queryStringParameters as Record<string, string | undefined>;

  const url = await s3.getSignedUrlPromise('putObject', {
    Bucket: process.env.BUCKET,
    Key: `import/${name}`,
    Expires: 60000
  })

  return formatJSONResponse({
    url
  });
};

export const main = importProductsFile;
