import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {requestSchema} from './schema'
import { v4 as uuidv4 } from 'uuid';
import { createProductItem } from 'src/common/create-product-item';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof requestSchema> = async (event) => {
  console.log(event)

  const { body } = event;
  const id = uuidv4();
  try {
    await createProductItem({ 
      count: body.count, 
      description: body.description, 
      price: body.price, 
      title: body.title 
    })

    return formatJSONResponse({
      message: 'item added'
    })
  } catch (err){
    return formatJSONResponse({ error: 'server error', err, body, id }, 500);
  }
  
};

export const main = middyfy(createProduct);
