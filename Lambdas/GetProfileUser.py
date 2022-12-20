import json
import boto3
dynamodb = boto3.resource('dynamodb')

def get_user(username):
    table = dynamodb.Table('Buddy-users-cognito')
    response = table.get_item(Key={'username':username})
    item = response['Item']
    print(item)
    return item

def lambda_handler(event, context):
    print(event, context)
    username = event['queryStringParameters']['username']
    info = get_user(username)
    return {
        'statusCode': 200,
        'headers': {"Access-Control-Allow-Origin":"*"},
        'body': json.dumps(info)
    }
