import json
import pandas as pd
import boto3
import io

def lambda_handler(event, context):
    # TODO implement
    aws_session = boto3.Session()
    client = aws_session.client('s3', region_name="us-east-1")
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    
    csv_obj = client.get_object(Bucket="buddy-event-data", Key="categories.csv")
    body = csv_obj['Body']
    df = pd.read_csv(io.BytesIO(body.read()))
    table = dynamodb.Table('EventCategory_Map')
    print("DynamoDB put_items called")
    for i, row in df.iterrows():
        table.put_item(Item=row.to_dict())
    print("DynamoDB put_items completed")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

