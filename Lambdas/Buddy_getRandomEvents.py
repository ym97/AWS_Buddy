import boto3 
import json
from datetime import datetime
import requests
from requests_aws4auth import AWS4Auth

region = 'us-east-1'
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
url = 'https://search-events-y4vrgeuppxdl5mic527au7yir4.us-east-1.es.amazonaws.com/events/_search'
headers = {"Content-Type": "application/json"}
dynamodb = boto3.resource('dynamodb', region_name=region)
table = dynamodb.Table('Events')
common_tags = ['new york events', 'new york parties', 'things to do in new york, ny']

def build_query_string():
    query_string = ''
    for tag in common_tags:
        query_string += ' (' + tag +') OR'
    query_string = query_string[:-2]
    return query_string
    
def lambda_handler(event, context):
    query_string = build_query_string()
    query = {
        "size": 20,
        "query": {
            "query_string": {
                "default_field": "tags",
                "query": query_string
            }
        }
    }
    
    request = requests.get(url, auth=awsauth, headers=headers, data=json.dumps(query)).json()
    result = request["hits"]["hits"]
    event_ids = []

    for res in result:
        id = res["_source"]["event_id"]
        event_ids.append(id)

    output = []
    event_ids = list(set(event_ids))
    for ID in event_ids:
        dynamoRes = table.get_item(Key={'ID': ID})
        try:
            eventName = dynamoRes['Item']['event_title']
            eventLat = dynamoRes['Item']['latitude']
            eventLon = dynamoRes['Item']['longitude']
            output.append({ 'id': ID, 'name': eventName, 'latitude': float(eventLat), 'longitude': float(eventLon) })
        except:
            continue
    print(output)
    print(len(output))
    return{
        'isBase64Encoded': False,
        'statusCode': 200,
        'headers': {"Access-Control-Allow-Origin":"*"},
        'body': json.dumps({
            'events': output,
        })
    }
