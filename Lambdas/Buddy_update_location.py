import boto3 
import json
import datetime
region = 'us-east-1'
language = 'en'
dynamodb = boto3.resource('dynamodb', region_name=region)

locationtable =  dynamodb.Table('buddy-locations')

def lambda_handler(event, context):
    username = event['queryStringParameters']['username']
    lat = str(event['queryStringParameters']['lat'])
    lng = str(event['queryStringParameters']['lng'])
    
    #Check if there is an entry in status table with this username
    #If yes
    #  update
    #If no
    #  Add new entry
    dynamoRes = locationtable.get_item(Key={'username': username})
    details = {'username': username, 'latitude': lat, 'longitude': lng}
    if 'Item' in dynamoRes:
        locationtable.delete_item(Key={'username': username})
    locationtable.put_item(Item=details)        
    return {
        'statusCode': 200,
        'headers': {"Access-Control-Allow-Origin":"*"},
        'body': json.dumps('Updated Location!')
    }



