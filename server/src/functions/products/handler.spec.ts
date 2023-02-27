import { main } from './handler';

describe('getProductsList', () => {
  it('should return a list of products', async () => {
    const response = await main();

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    const parsedBody = JSON.parse(response.body);
    expect(parsedBody.products).toBeDefined();
    expect(Array.isArray(parsedBody.products)).toBe(true);
  });
});
