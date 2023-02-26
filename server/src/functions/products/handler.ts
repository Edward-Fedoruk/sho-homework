import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { mockProductData } from './mockProducts';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<undefined> = async () => {
  
  return formatJSONResponse({
    products: mockProductData
  });
};

export const main = getProductsList;
