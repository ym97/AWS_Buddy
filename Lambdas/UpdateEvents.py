import json
import boto3
import json
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Events')

def lambda_handler(event, context):
    # TODO implement
    response = table.scan()
    items = response['Items']
    for row in items:
        if row['end_date'] == None:
            print(row)
            response = table.delete_item(
                        Key={
                            'ID': row['ID']
                        }
                    )
    
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
