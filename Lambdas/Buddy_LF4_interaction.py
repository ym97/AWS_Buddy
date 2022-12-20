import pymysql 
import json
import datetime
import boto3

endpoint = 'event-user-status.cusypt0l0ok0.us-east-1.rds.amazonaws.com'
username = 'admin'
password = 'buddybuddy'
database_name = 'sys'
connection = pymysql.connect( host=endpoint, user=username, password=password, db=database_name)

AppInstanceArn = "arn:aws:chime:us-east-1:103326859418:app-instance/5cf7a65e-4614-424c-aee0-663221b7110f"
AdminArn = "us-east-1:38e98f2f-ab50-467b-8f6f-858a199cca9c"
ChimeBearer = AppInstanceArn + '/user/' + AdminArn

cognito_client = boto3.client('cognito-idp')

client = boto3.client('chime-sdk-messaging')

def get_phrases( text ):
    response = comprehend.detect_key_phrases(Text=text, LanguageCode=language)
    tags = []
    for res in response['KeyPhrases']:
        tags.append(res['Text'])
    return tags
    
def get_channel_arn(eventID):
    table = boto3.resource('dynamodb').Table('Events')
    response = table.get_item(Key={'ID': eventID})
    item = response['Item']
    print(item)
    if('group' in item.keys()):
        channelArn = item['group']
    else:
        channelArn = None
    return channelArn

def get_user_arn(username):
    AppInstanceArn = "arn:aws:chime:us-east-1:103326859418:app-instance/5cf7a65e-4614-424c-aee0-663221b7110f"
    cognitoUserPoolId = 'us-east-1_BeCQidvtv'
    clientId = '3gv9ldh5fpkb03jdron6si3jra'
    response = cognito_client.admin_get_user(
        UserPoolId=cognitoUserPoolId,
        Username=username
    )
    profile = None
    for att in response['UserAttributes']:
        if(att['Name']=='profile'):
            if(att['Value']=='none'):
                profile = None
            else:
                profile = att['Value']
    if(profile):
        return AppInstanceArn + '/user/' + profile
    else:
        return None

def add_to_group(channelArn, userArn):
    # What happens if user already in the group
    try:
        response = client.create_channel_membership(
            ChannelArn=channelArn,
            MemberArn=userArn,
            Type='DEFAULT',
            ChimeBearer=ChimeBearer
        )
        print(response)
    except:
        print("Exception occured when adding user to group")
    
def check_update_group_membership(channelArn, userArn):
    try:
        response = client.describe_channel_membership(
            ChannelArn=channelArn,
            MemberArn=userArn,
            ChimeBearer=ChimeBearer
        )
        print(response)
    except:
        # Probably user not in the group, so add
        add_to_group(channelArn, userArn)

def delete_from_group(channelArn, userArn):
    # What happens if user not in the group
    try:
        response = client.delete_channel_membership(
            ChannelArn=channelArn,
            MemberArn=userArn,
            ChimeBearer=ChimeBearer
        )
        print(response)
    except:
        print("Exception occured when deleting user from group")

def lambda_handler(event, context):
    userID = event['queryStringParameters']['userID']
    eventID = event['queryStringParameters']['eventID']
    newstatus = event['queryStringParameters']['status']
    

    channelArn = get_channel_arn(eventID)
    userArn = get_user_arn(userID)
    
    
    # userID = 'YM1'
    # eventID = '442990906727'
    # newstatus = 'Interested'
    
    #Check if there is an entry in status table with this userID,eventID combo
    #If yes
    #  if new update is Not Going, then 'delete' that entry
    #  else update it with either Going/Interested if the current status is different from the one in the table
    #If no
    #  Add new entry if the status is Going/Interested.
    cursor = connection.cursor()
    myQuery = 'SELECT * FROM user_event_status where userID=\''+str(userID) +'\' and eventID=\''+str(eventID)+'\''
    print(myQuery)
    cursor.execute(myQuery)
    rows = cursor.fetchall()
    print(rows)
    if len(rows) == 0:
        if newstatus != 'Not Going':
            myQuery = 'INSERT INTO user_event_status VALUES (\''+ str(userID) + '\', \'' + str(eventID) + '\',\''+newstatus +'\')'
            print(myQuery)
            cursor.execute(myQuery)
            
            if(channelArn and userArn):
                add_to_group(channelArn, userArn)

    else:
        if newstatus == 'Not Going':
            myQuery = 'DELETE FROM user_event_status WHERE eventID= \''+ str(eventID) + '\' and userID= \'' + str(userID) + '\''
            print(myQuery)
            cursor.execute(myQuery)
            
            if(channelArn and userArn):
                delete_from_group(channelArn, userArn)

        elif newstatus != rows[0][2]:
            myQuery = 'UPDATE user_event_status SET status=\''+newstatus+'\' WHERE eventID= \''+ str(eventID) + '\' and userID= \'' + str(userID) + '\''
            print(myQuery)
            cursor.execute(myQuery)
            
            if(channelArn and userArn):
                check_update_group_membership(channelArn, userArn)

    connection.commit() 
    cursor.close()
    return {
        'statusCode': 200,
        'headers': {"Access-Control-Allow-Origin":"*"},
        'body': json.dumps('Updated Statu!')
    }





# import boto3 
# import json
# import datetime
# region = 'us-east-1'
# language = 'en'
# dynamodb = boto3.resource('dynamodb', region_name=region)

# statustable =  dynamodb.Table('buddy-event-status')

# def get_phrases( text ):
#     response = comprehend.detect_key_phrases(Text=text, LanguageCode=language)
#     tags = []
#     for res in response['KeyPhrases']:
#         tags.append(res['Text'])
#     return tags    
    
# def lambda_handler(event, context):
#     userID = event['queryStringParameters']['userID']
#     eventID = event['queryStringParameters']['eventID']
#     newstatus = event['queryStringParameters']['status']
    
#     #Check if there is an entry in status table with this userID,eventID combo
#     #If yes
#     #  if new update is Not Going, then 'delete' that entry
#     #  else update it with either Going/Interested if the current status is different from the one in the table
#     #If no
#     #  Add new entry if the status is Going/Interested.
#     myKey = str(eventID)+':'+str(userID)
#     dynamoRes = statustable.get_item(Key={'myKey': myKey})
#     if 'Item' not in dynamoRes:
#         if newstatus != 'Not Going':
#             details = {'myKey': myKey, 'status': newstatus}
#             statustable.put_item(Item=details)
#     else:
#         if newstatus == 'Not Going':
#             statustable.delete_item(Key={'myKey':myKey})
#         elif newstatus != dynamoRes['status']:
#             statustable.delete_item(Key={'myKey':myKey})
#             details = {'myKey': myKey, 'status': status}
#             statustable.put_item(Item=details)
            
#     return {
#         'statusCode': 200,
#         'headers': {"Access-Control-Allow-Origin":"*"},
#         'body': json.dumps('Updated Statu!')
#     }



