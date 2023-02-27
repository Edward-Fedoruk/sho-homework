import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { mockProductData } from './mockProducts';


const getProductsById: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
  const { productId } = event.pathParameters as Record<string, string | undefined>;
  
  const mockProduct = mockProductData.find((p) => p.id === productId)

  if (!mockProduct) {
    return formatJSONResponse({
      code: 404,
      body: {
        error: `can not find product with id ${productId}`
      }
    })
  }

  return formatJSONResponse(mockProduct);
  
};

export const main = getProductsById;
