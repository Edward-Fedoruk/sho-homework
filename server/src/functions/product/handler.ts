import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
  return formatJSONResponse({
    id: "1",
    title: "Product 1",
    description: "Description for Product 1",
    price: 10,
    count: 1,
  });
};

export const main = getProductsById;
