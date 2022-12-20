import json
import boto3
import requests
from requests_aws4auth import AWS4Auth
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    #USERNAME
    username = event['queryStringParameters']['username']
    
    
    ###BUDDY RECOMMENDER
    
    dynamodb = boto3.client('dynamodb')
    client = boto3.client('dynamodb')
    # print(event['username'])
    # username = event['username']
    data_user = dynamodb.get_item(
    TableName='Buddy-users-cognito',
    Key={
        'username': {
          'S': username
        }
    }
  )
    #print(data_user)
    user_desc = data_user['Item']['description']['S']
    user_interests = data_user['Item']['interests']['L']
    user_age = data_user['Item']['age']['S']
    user_pin = data_user['Item']['pincode']['S']
    #print(user_desc)
    #print(data['Item']['interests']['L'])
    #print(data['Item']['description']['S'])
    #print(data['Item']['age']['S'])
    #categories
    data = client.scan(
    TableName='Buddy-users-cognito'
  )
    peoples_description = []
    people_username= []
    
    #print(data)
    ranks = []
    for i in data['Items']:
        score_i = 0
        #print(i)
        try:
            count = 0
            peoples_description = i['description']['S']
            people_interest = i['interests']['L']
            #print(people_interest,user_interests, i)
            #print(people_interest,user_interests)
            for j in people_interest:
                interestj = j['S']
                for k in user_interests:
                    interestk = k['S']
                    #print(interestj,interestk)
                    if interestj == interestk:
                        count += 1
            #print(count)
            ranks.append([count,i['username']["S"]])
        except:
            pass
    
    
    ranks.sort()    
    
    
    if ranks:
        ranksfinal = []
        
        for i in range(3):
            guyi = ranks[i][1]
            #print(guyi)
            useri = dynamodb.get_item(
            TableName='Buddy-users-cognito',
            Key={
                'username': {
                  'S': guyi
                }
            }
          )
            #print(useri)
            guyi_description = useri['Item']['description']['S']
            if len(guyi_description) >1 and len(user_desc)>1:
                url = "https://api.dandelion.eu/datatxt/sim/v1/?text1=" + guyi_description +"&text2=" +user_desc + "&token=ba1d7f8d617b4531b60fd7febbe3df69"
                try:
                    response = requests.get(url)
                    score  = response.json()['similarity']
                except:
                    
                    score = 0
                ranksfinal.append([score,guyi])
            else:
                ranksfinal.append([0,guyi])
        ranksfinal.sort()
        #print(ranksfinal)
        buddy_list = []
        for i in ranksfinal:
            buddy_list.append(i[1])
        print(buddy_list)  
    else:
        buddy_list = []
    
    #YM
    #Adding the location information
    region = 'us-east-1'
    print(buddy_list)
    for i in buddy_list:
        if i == 'Admin':
            buddy_list.remove(i)
    buddy_details = []
    print(buddy_list)
    dynamodb = boto3.resource('dynamodb', region_name=region)
    locationInfo = dynamodb.Table('buddy-locations')
    for user1 in buddy_list:
        dynamoLocRes = locationInfo.get_item(Key={'username': user1})
        print("locstion",dynamoLocRes)
        if 'Item' in dynamoLocRes:
            buddy_details.append({'username': user1, 'latitude': float(dynamoLocRes['Item']['latitude']), 'longitude': float(dynamoLocRes['Item']['longitude'])})
    
                 
    print("end of buddy rec")
    
    ##EVENT RECOMMENDER
    
    # dynamodb = boto3.resource('dynamodb', region_name=region)
    table = dynamodb.Table('EventCategory_Map')
    subcats= []
 
    for interest in user_interests:
        response = table.scan(FilterExpression=Attr("Parent_Category").eq(interest['S']))
        #print(response['Items'])
        s = [item['Category'] for item in response['Items']]
        subcats.extend(s)
    
    #print(subcats)
    table = dynamodb.Table('Search_History')
    data = table.query(
    KeyConditionExpression=Key("username").eq(username)
    )
    counter = 0
    for item in data['Items']:
        #print(item)
        subcats.extend(item['event_tags'])
        counter +=1
        if counter > 2 :
            pass
    
    subcats = list(set(subcats))
    
    service = 'es'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
    url = 'https://search-events-y4vrgeuppxdl5mic527au7yir4.us-east-1.es.amazonaws.com/events/_search'
    headers = {"Content-Type": "application/json"}
    query_string = ''
    if len(subcats) == 1:
        query_string = '(' + subcats[0] + ')'
    elif len(subcats) > 1:
        query_string = '(' + subcats[0] + ')'
        for i in range(len(subcats) - 1):
            query_string = query_string + ' OR (' + subcats[i + 1] + ')'
    
    #print(query_string)
    query = {
        "size": 35,
        "query": {
            "query_string": {
                "default_field": "tags",
                "query": query_string
            }
        }
    }
    print(query)
    request = requests.get(url, auth=awsauth, headers=headers, data=json.dumps(query)).json()
    print(request["hits"]["hits"])
    try:
        result = request["hits"]["hits"]
    except:
        result = []
    print("results",result)
    event_ids = []
    
    for res in result:
        id = res["_source"]["event_id"]
        event_ids.append(id)

    ## Here add the opensearch response in such a way that it returns the relevant eventIDs as a list or so
    #Temp IDs to test
    IDs = event_ids
    IDs = list(set(IDs))
    table = dynamodb.Table('Events')
    output = []
    for ID in IDs:
        dynamoRes = table.get_item(Key={'ID': ID})
        #print(dynamoRes)
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
    
    print(output)
    return{
        'isBase64Encoded': False,
        'statusCode': 200,
        'headers': {"Access-Control-Allow-Origin":"*"},
        'body': json.dumps({
            'buddy_list': buddy_details,
            'event_list' : output
        })
    }
