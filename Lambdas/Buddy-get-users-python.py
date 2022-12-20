import json
import boto3
#function definition
import json
def lambda_handler(event,context):
    print(event);
    username = event['userName']
    email = event['request']['userAttributes']['email']
    pincode = event['request']['clientMetadata']['pincode']
    age = event['request']['clientMetadata']['age']
    description = event['request']['clientMetadata']['information']
    interests_obj = json.loads(event['request']['clientMetadata']['interests'])
    interests = interests_obj['value']
    dynamodb = boto3.resource('dynamodb')
    #table name
    table = dynamodb.Table('Buddy-users-cognito')
    response = table.put_item(
      Item={
            'username': username, 'email' : email, 
            'pincode': pincode, 'age': age,
            'interests': interests, 'description': description
        }
    )
    return event