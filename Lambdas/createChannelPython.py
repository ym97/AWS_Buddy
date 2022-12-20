import json

import boto3
import boto3

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
def delete_channel(channelArn):
    response = client.delete_channel(
        ChannelArn=channelArn,
        ChimeBearer=ChimeBearer
    )

def updateGroupInTable(eventID, groupID):
    table = boto3.resource('dynamodb').Table('Events')
    response = table.get_item(Key={'ID': eventID})
    item = response['Item']
    item['group'] = groupID
    table.put_item(Item=item)

def lambda_handler(event, context):
    print(event);
    for record in event["Records"]:
        print(record)
        if(record["eventName"] =="INSERT"):
            eventID = record["dynamodb"]["Keys"]["ID"]["S"]
            if('title' in record["dynamodb"]["NewImage"].keys()):
                title = record["dynamodb"]["NewImage"]["title"]["S"]
            else:
                title = eventID
            groupID = create_channel(title)
            print("THIS IS THE GROUP")
            print(groupID)
            updateGroupInTable(eventID, groupID)
            print("GROUP WAS UPDATED IN TABLE")
        if(record["eventName"] =="MODIFY"):
            eventID = record["dynamodb"]["Keys"]["ID"]["S"]
            if('group' in record["dynamodb"]["NewImage"].keys()):
                return
            if('group' in record["dynamodb"]["OldImage"].keys()):
                groupID = record["dynamodb"]["OldImage"]["group"]["S"]
                updateGroupInTable(eventID, groupID)
            else:
                if('title' in record["dynamodb"]["NewImage"].keys()):
                    title = record["dynamodb"]["NewImage"]["title"]["S"]
                else:
                    title = eventID
                groupID = create_channel(title)
                print("THIS IS THE GROUP")
                print(groupID)
                updateGroupInTable(eventID, groupID)
                print("GROUP WAS UPDATED IN TABLE")
                
        if(record["eventName"] =="REMOVE"):
            print("Inside delete")
            if('group' in record["dynamodb"]["OldImage"].keys()):
                groupID = record["dynamodb"]["OldImage"]["group"]["S"]
                delete_channel(groupID)
                print("DELETED")
            else:
                print("No group to be deleted")
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
