import type { ValidatedAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { mockProductData } from './mockProducts';


const getProductsById = async (event: ValidatedAPIGatewayProxyEvent<null>) => {
  const { productId } = event.pathParameters as Record<string, string | undefined>;
  
  const mockProduct = mockProductData.find((p) => p.id === productId)
  if (!mockProduct) {
    console.log(mockProduct)

    return formatJSONResponse({
      body: {
        error: `can not find product with id ${productId}`
      }
    }, 404)
  }

  return formatJSONResponse(mockProduct);
  
};

export const main = getProductsById;
