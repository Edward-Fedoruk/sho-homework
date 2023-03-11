import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { dynamodb } from '@libs/dynamo';
import {requestSchema} from './schema'
import { v4 as uuidv4 } from 'uuid';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof requestSchema> = async (event) => {
  console.log(event)

  const { body } = event;
  const id = uuidv4();
  try {
    await dynamodb.transactWriteItems({
      TransactItems: [
        {
          Put: {
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Item: {
              id: { S: id },
              title: { S: body.title },
              description: { S: body.description },
              price: { N: `${body.price}` },
            }
          }
        },
        {
          Put: {
            TableName: process.env.STOCKS_TABLE_NAME,
            Item: {
              product_id: { S: id },
              count: { N: `${body.count}` },
            }
          }
        }
      ]
    }).promise()
    
    return formatJSONResponse({
      message: 'item added'
    })
  } catch (err){
    return formatJSONResponse({ error: 'server error', err, body, id }, 500);
  }
  
};

export const main = middyfy(createProduct);
