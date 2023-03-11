import { formatJSONResponse } from '@libs/api-gateway';
import { dynamodb, formatItems } from '@libs/dynamo';
import { Product } from 'src/types/product';
import { Stock } from 'src/types/stock';

const getProductsList = async () => {
  try {

  const products = await dynamodb.scan({
    TableName: process.env.PRODUCTS_TABLE_NAME,
  }).promise()
  
  const stocks = await dynamodb.scan({
    TableName: process.env.STOCKS_TABLE_NAME,
  }).promise()

  const formattedStocks = formatItems<Stock>(stocks.Items);
  const formattedProducts = formatItems<Product>(products.Items);

  const joinedProducts = formattedProducts.map((product) => {
    const formattedStock = formattedStocks.find(({ product_id }) => product_id === product.id);
    return {
      count: formattedStock?.count ?? 0,
      ...product
    }
  })
  
  console.log(joinedProducts)

  return formatJSONResponse({
    products: joinedProducts
  });
  } catch (err) {
    return formatJSONResponse({
      err
    }, 500);
  }
};

export const main = getProductsList;
