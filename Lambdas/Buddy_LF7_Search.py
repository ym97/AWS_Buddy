import boto3 
import json
from datetime import datetime
import requests
from requests_aws4auth import AWS4Auth

region = 'us-east-1'
language = 'en'
comprehend = boto3.client('comprehend', region_name=region)
dynamodb = boto3.resource('dynamodb', region_name=region)
table = dynamodb.Table('Events')
history_table = dynamodb.Table('Search_History')

def get_phrases( text ):
    response = comprehend.detect_key_phrases(Text=text, LanguageCode=language)
    print('get_phrases',response)
    tags = []
    for res in response['KeyPhrases']:
        tags.append(res['Text'])
    #Additional string splits
    search_words = [word.strip() for word in text.split(' ')]    
    tags.extend(search_words)
    return tags    
    
def lambda_handler(event, context):
    msg_from_user = event['queryStringParameters']['q']
    #msg_from_user = 'Mexican music flute'
    print(f"Message from frontend: {msg_from_user}")
    phrases = get_phrases(msg_from_user)
    print('phrases',phrases)
    item = {}
    item['username'] = event['queryStringParameters']['username']
    item['TimeStamp'] = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
    item['event_tags'] = phrases
    history_table.put_item(Item=item)
    #TODO
    #Add search from search index here!
    #From opensearch, get the event IDs 
    query_string = ''
    if len(phrases) == 1:
        query_string = '(' + phrases[0] + ')'
    elif len(phrases) > 1:
        query_string = '(' + phrases[0] + ')'
        for i in range(len(phrases) - 1):
            query_string = query_string + ' OR (' + phrases[i + 1] + ')'
    print('query_string',query_string)
    query = {
        "size": 35,
        "query": {
            "query_string": {
                "default_field": "tags",
                "query": query_string
            }
        }
    }
    
    region = 'us-east-1'
    service = 'es'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
    url = 'https://search-events-y4vrgeuppxdl5mic527au7yir4.us-east-1.es.amazonaws.com/events/_search'
    headers = {"Content-Type": "application/json"}

    request = requests.get(url, auth=awsauth, headers=headers, data=json.dumps(query)).json()
    #print(request)
    try:
        result = request["hits"]["hits"]
    except:
        result = []
        
    event_ids = []

    for res in result:
        id = res["_source"]["event_id"]
        event_ids.append(id)

    ## Here add the opensearch response in such a way that it returns the relevant eventIDs as a list or so
    #Temp IDs to test
    IDs = event_ids
    IDs = list(set(IDs))
    print(IDs)
    output = []
    for ID in IDs:
        dynamoRes = table.get_item(Key={'ID': ID})
        print('dres',dynamoRes)
        try:
            eventName = dynamoRes['Item']['event_title']
            eventLat = dynamoRes['Item']['latitude']
            eventLon = dynamoRes['Item']['longitude']
            output.append({ 'id': ID, 'name': eventName, 'latitude': float(eventLat), 'longitude': float(eventLon) })
        except:# KeyError:
            continue
            #print(KeyError)
        # except KeyError:
        #     print(KeyError)
    
    
    return{
        'isBase64Encoded': False,
        'statusCode': 200,
        'headers': {"Access-Control-Allow-Origin":"*"},
        'body': json.dumps({
            'tags': phrases,
            'events': output,
        })
    }


