import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { dynamodb } from '@libs/dynamo';
import {requestSchema} from './schema'
import { v4 as uuidv4 } from 'uuid';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof requestSchema> = async (event) => {
  const { body } = event;
  
  try {
    await dynamodb.transactWriteItems({
      TransactItems: [
        {
          Put: {
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Item: {
              id: { S: uuidv4() },
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
              product_id: { S: uuidv4() },
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
    return formatJSONResponse({ error: 'server error' }, 500);
  }
  
};

export const main = getProductsById;
