import { formatJSONResponse } from '@libs/api-gateway';
import { mockProductData } from './mockProducts';

const getProductsList = async () => {
  
  return formatJSONResponse({
    products: mockProductData
  });
};

export const main = getProductsList;
