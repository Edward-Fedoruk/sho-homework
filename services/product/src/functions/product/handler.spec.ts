import { APIGatewayProxyEvent } from 'aws-lambda';
import { main } from './handler';

describe('getProductsById', () => {
  it('returns the correct product for a valid product ID', async () => {
    const mockEvent: APIGatewayProxyEvent = {
      pathParameters: {
        productId: '1'
      }
    } as unknown as APIGatewayProxyEvent;

    const response = await main(mockEvent);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(typeof response.body).toBe('string');

    const parsedBody = JSON.parse(response.body);
    expect(parsedBody).toMatchObject({
      id: '1',
      title: 'Product 1',
      price: 10
    });
  });

  it('returns a 404 error for an invalid product ID', async () => {
    const mockEvent: APIGatewayProxyEvent = {
      pathParameters: {
        productId: '999'
      }
    } as unknown as APIGatewayProxyEvent;

    const response = await main(mockEvent);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeDefined();
    expect(typeof response.body).toBe('string');

    const parsedBody = JSON.parse(response.body);
    expect(parsedBody).toMatchObject({
      body: {
        error: 'can not find product with id 999'
      }
    });
  });
});
