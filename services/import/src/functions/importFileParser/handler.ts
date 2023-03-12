import { formatJSONResponse } from '@libs/api-gateway';
import { S3CreateEvent } from 'aws-lambda';
import { S3 } from 'aws-sdk'
import csv from 'csv-parser'

const s3 = new S3({ region: process.env.REGION })

const importFileParser = async (event: S3CreateEvent) => {
  try {
    const results: any = [];

    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    
    console.log(`Object created in bucket: ${bucket}, key: ${key}`);
    
    // Get the object data using a stream
    const parseCsv = () => new Promise((resolve, reject) => {
      s3.getObject({ Bucket: bucket, Key: key }).createReadStream()
        .pipe(csv())
        .on('data', data => {
          results.push(data)
          console.log(data)
        })
        .on('end', () => {
          console.log('File data:', results);
          resolve(results)
        })
        .on('error', (err) => reject(err));
    })
    
    const res = await parseCsv()

    return formatJSONResponse({
      message: 'Object processed successfully!',
      res
    });
  } catch (error) {
    console.error(error);
    return formatJSONResponse({
      message: 'Error processing the object',
    }, 500);
  }
};

export const main = importFileParser;
