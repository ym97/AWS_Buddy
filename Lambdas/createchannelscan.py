import boto3
import json
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Events')

cognito_client = boto3.client('cognito-idp')
client = boto3.client('chime-sdk-messaging')

AppInstanceArn = "arn:aws:chime:us-east-1:103326859418:app-instance/5cf7a65e-4614-424c-aee0-663221b7110f"
Privacy = "PRIVATE"
AdminArn = "us-east-1:38e98f2f-ab50-467b-8f6f-858a199cca9c"
ChimeBearer = AppInstanceArn + '/user/' + AdminArn


def create_channel(name):
    response = client.create_channel(
        AppInstanceArn=AppInstanceArn,
        Name=name,
        Mode='RESTRICTED',
        Privacy=Privacy,
        ChimeBearer=ChimeBearer,
    )
    print(response)
    print(response["ChannelArn"])
    return response["ChannelArn"]

def updateGroupInTable(eventID, groupID):
    table = boto3.resource('dynamodb').Table('Events')
    response = table.get_item(Key={'ID': eventID})
    item = response['Item']
    item['group'] = groupID
    table.put_item(Item=item)
    
import datetime



def lambda_handler(event, context):


    response = table.scan()
    items = response['Items']
    
    while response.get('LastEvaluatedKey'):
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response['Items'])
    for row in items:
        eventID = row['ID']
        if('group' not in row.keys()):
            if('title' in row.keys()):
                title = row['title']
            else:
                title = eventID
            groupID = create_channel(title)
            print("THIS IS THE GROUP")
            print(groupID)
            updateGroupInTable(eventID, groupID)
            print("GROUP WAS UPDATED IN TABLE")
        
        if('end_date' in row.keys()):
            end_date_time = datetime.datetime.strptime(row['end_date'], "%Y-%m-%dT%H:%M:%S%z")
            
            now = datetime.datetime.now(end_date_time.tzinfo)
            if(end_date_time < now):
                local_date_time_str = end_date_time.strftime("%B %d, %Y %I:%M %p")
                try:
                    response = table.delete_item(
                        Key={
                            'ID': eventID
                        }
                    )
                except:
                    print("Couldnot delete event entry")
                print(local_date_time_str)
                print("Expired Event")

            
            
    

