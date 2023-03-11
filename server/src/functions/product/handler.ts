import type { ValidatedAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { dynamodb, formatItems } from '@libs/dynamo';
import { Product } from 'src/types/product';
import { Stock } from 'src/types/stock';

const getProductsById = async (event: ValidatedAPIGatewayProxyEvent<null>) => {
  console.log(event)

  const productId = event?.pathParameters?.productId;
  
  try {
    const product = await dynamodb.query({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ":id": {
          S: `${productId}`,
        }
      } 
    }).promise()
    const stocks = await dynamodb.query({
      TableName: process.env.STOCKS_TABLE_NAME,
      KeyConditionExpression: 'product_id = :id',
      ExpressionAttributeValues: {
        ":id": {
          S: `${productId}`,
        }
      } 
    }).promise()

    const [formattedProduct] = formatItems<Product>(product.Items);
    const [formattedStocks] = formatItems<Stock>(stocks.Items);

    if (!Boolean(formattedProduct) || !Boolean(formattedStocks)) {
      return formatJSONResponse({ error: `could not find the product with id ${productId}` }, 404);
    }

    return formatJSONResponse({
      ...(formattedProduct ?? {}),
      count: formattedStocks?.count
    })
  } catch (err){

    return formatJSONResponse({ error: 'server error' }, 500);
  }
  
};

export const main = getProductsById;
