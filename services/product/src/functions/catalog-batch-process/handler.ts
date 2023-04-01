import { SQSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk'
import { createProductItem } from 'src/common/create-product-item';

const sns = new SNS({ region: process.env.REGION })

const catalogBatchProcess = async (event: SQSEvent) => {
  console.log('Received event:', JSON.stringify(event));
  
  const { Records } = event;

  try {

    const parsedProducts = Records.map((record) => {
      const body = JSON.parse(record.body)
      return {
        count: body.count, 
        description: body.description, 
        price: body.price, 
        title: body.title 
      }
    })

    const productCreateRequests = parsedProducts.map((record) => createProductItem(record))
    
    await Promise.allSettled(productCreateRequests).then((responses) => {
      responses.forEach((res, i) => console.log(
        `record: ${Records[i].body}`, 
        `item create result: ${res.status}, ${res.status === 'fulfilled' ? res.value : res.reason}`
      ))

      return responses;
    })

    console.log(process.env.TOPIC_ARN)
    await Promise.allSettled(parsedProducts.map((record) => {
      return sns.publish({
        Message: JSON.stringify(record),
        TopicArn: process.env.TOPIC_ARN,
      }).promise()
    })).then(res => console.log(res.map(res => res.status === 'fulfilled' ? res.value : res.reason)))

  } catch(err) {
    console.log(err)
  }
};

export const main = catalogBatchProcess;
