import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

const basicAuthorizer  = async (event: APIGatewayTokenAuthorizerEvent, context, callback) => {
  console.log(event)
  const { methodArn, authorizationToken } = event
  process.env.TOKEN === authorizationToken ? 
  callback(null, {
    principalId: authorizationToken,
    policyDocument: {
    Version: '2012-10-17',
    Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: methodArn
    }]
  }
  }) :   callback(null, {
    principalId: authorizationToken,
    policyDocument: {
    Version: '2012-10-17',
    Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Resource: methodArn
    }]
  }
  })
};

export const main = basicAuthorizer;
