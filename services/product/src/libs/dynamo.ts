import { DynamoDB } from 'aws-sdk';
import { ItemList } from 'aws-sdk/clients/dynamodb';

export const dynamodb = new DynamoDB({ 
  region: process.env.REGION,
  endpoint: process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8000',
});

export const formatItems = <D>(items?: ItemList): Array<D> => {
  return items?.map((item) => DynamoDB.Converter.unmarshall(item)) as D[]
}
