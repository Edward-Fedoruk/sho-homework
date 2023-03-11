export AWS_PROFILE=Admin
export AWS_REGION=us-east-1

aws dynamodb create-table \
    --table-name products \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

aws dynamodb put-item \
    --table-name products \
    --item '{"id": {"S": "123e4567-e89b-12d3-a456-426655440000"}, "title": {"S": "Product 1"}, "description": {"S": "Description of Product 1"}, "price": {"N": "100"}}'

aws dynamodb create-table \
    --table-name stocks \
    --attribute-definitions AttributeName=product_id,AttributeType=S \
    --key-schema AttributeName=product_id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

aws dynamodb put-item \
    --table-name stocks \
    --item '{"product_id": {"S": "123e4567-e89b-12d3-a456-426655440001"}, "count": {"N": "0"}}'
