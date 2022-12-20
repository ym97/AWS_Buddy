import boto3 
import json
import pymysql
region = 'us-east-1'
language = 'en'
dynamodb = boto3.resource('dynamodb', region_name=region)
# eventstable =  dynamodb.Table('temp_events')
eventstable =  dynamodb.Table('Events')
buddytable =  dynamodb.Table('Buddy-users-cognito')

endpoint = 'event-user-status.cusypt0l0ok0.us-east-1.rds.amazonaws.com'
username = 'admin'
password = 'buddybuddy'
database_name = 'sys'
connection = pymysql.connect( host=endpoint, user=username, password=password, db=database_name)

# TODO
#Also, read the person names/IDs who are Going to event
#Update: The userID is itself the username so no need to add more details

required_event = ['address', 'direction_url', 'start_date', 'end_date', 'event_summary', 'url']
def eventdetails( eventID, userID ):
    #Event details
    dynamoRes = eventstable.get_item(Key={'ID': eventID})
    out = {}
    for a in required_event:
        out[a] = dynamoRes['Item'][a]
    
    #People going/interested to the event
    cursor = connection.cursor()
    myQuery = 'SELECT userID,status FROM user_event_status where eventID=\''+str(eventID)+'\''
    print(myQuery)
    cursor.execute(myQuery)
    out['Interested'] = []
    out['Going'] = []
    rows = cursor.fetchall()
    print(rows)
    for row in rows:
        if row[1] in out:
            out[ row[1] ].append(row[0])
        else:
            out[row[1]] = [row[0]]
    print(out)        
    connection.commit()
    cursor.close()
    return out

required_buddy = ['age', 'description', 'email', 'interests', 'pincode']
def buddydetails( userID ):
    #Buddy details
    dynamoRes = buddytable.get_item(Key={'username': userID})
    out = {}
    for a in required_buddy:
        if a=='age':
            out[a] = str(dynamoRes['Item'][a])
        elif a == 'interests':
            out[a] = list(dynamoRes['Item'][a])
        else:
            out[a] = dynamoRes['Item'][a]
    #Going/interested events
    cursor = connection.cursor()
    myQuery = 'SELECT eventID,status FROM user_event_status where userID=\''+str(userID)+'\''
    print(myQuery)
    cursor.execute(myQuery)
    out['Interested'] = []
    out['Going'] = []
    rows = cursor.fetchall()
    print(rows)
    for row in rows:
        eventdynamoRes = eventstable.get_item(Key={'ID': row[0]})
        try:
            dets = [eventdynamoRes['Item']['event_title'], eventdynamoRes['Item']['url']]
            if row[1] in out:
                out[ row[1] ].append(dets)
            else:
                out[ row[1] ] = [dets]
        except:
            continue
    print(out)        
    connection.commit()
    cursor.close()
    return out
    
def lambda_handler(event, context):
    out = {}
    print(event['queryStringParameters'])
    userID = event['queryStringParameters']['userID']
    if 'eventID' in event['queryStringParameters']:
        #This means we want event details
        eventID = event['queryStringParameters']['eventID']
        out = eventdetails(eventID, userID)
    else:
        #This means we want buddy details
        out = buddydetails(userID)
    
    # out = buddydetails('Yara')
    # eventID = '442990906727'
    # userID = 'Manisha'
    
    return {
        'statusCode': 200,
        'headers': {"Access-Control-Allow-Origin":"*"},
        'body': json.dumps(out)
    }



