import { v4 as uuidv4 } from 'uuid';
import { dynamodb } from '@libs/dynamo';

export const createProductItem = async ({ title, description, count, price }) => {
  const id = uuidv4();

  return await dynamodb.transactWriteItems({
    TransactItems: [
      {
        Put: {
          TableName: process.env.PRODUCTS_TABLE_NAME,
          Item: {
            id: { S: id },
            title: { S: title },
            description: { S: description },
            price: { N: `${price}` },
          }
        }
      },
      {
        Put: {
          TableName: process.env.STOCKS_TABLE_NAME,
          Item: {
            product_id: { S: id },
            count: { N: `${count}` },
          }
        }
      }
    ]
  }).promise()
  
}