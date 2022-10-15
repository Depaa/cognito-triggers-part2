from __future__ import print_function

import boto3
from decimal import Decimal
import json
import urllib
import os

dynamodb = boto3.client('dynamodb')
s3 = boto3.client('s3')
rekognition = boto3.client('rekognition')


# --------------- Helper Functions ------------------

def index_faces(bucket, key):

    response = rekognition.index_faces(
        Image={"S3Object": {"Bucket": bucket, "Name": key}},
        CollectionId=os.environ['COLLECTION_NAME'])
    return response


def update_index(tableName, faceId, fullName):
    response = dynamodb.put_item(
        TableName=tableName,
        Item={
            'RekognitionId': {'S': faceId},
            'FullName': {'S': fullName}
        }
    )

# --------------- Main handler ------------------


def handler(event, context):
    print(event);

    # Get the object from the event
    # bucket = event['Records'][0]['s3']['bucket']['name']
    # key = urllib.parse.unquote_plus(
    #     event['Records'][0]['s3']['object']['key'].encode('utf8'))

    # try:

    #     # Calls Amazon Rekognition IndexFaces API to detect faces in S3 object
    #     # to index faces into specified collection

    #     response = index_faces(bucket, key)

    #     # Commit faceId and full name object metadata to DynamoDB

    #     if response['ResponseMetadata']['HTTPStatusCode'] == 200:
    #         faceId = response['FaceRecords'][0]['Face']['FaceId']
    #         ret = s3.head_object(Bucket=bucket, Key=key)
    #         email = ret['Metadata']['email']
    #         update_index(os.environ['COLLECTION_NAME'], faceId, email)
    #     return response
    # except Exception as e:
    #     print("Error processing object {} from bucket {}. ".format(key, bucket))
    #     raise e

# {
#   Records: [
#     {
#       eventVersion: '2.1',
#       eventSource: 'aws:s3',
#       awsRegion: 'eu-central-1',
#       eventTime: '2022-10-15T10:00:22.825Z',
#       eventName: 'ObjectCreated:Put',
#       userIdentity: { principalId: 'AWS:AIDAQGQPLD7UZI4SWNSEL' },
#       requestParameters: { sourceIPAddress: '82.54.180.190' },
#       responseElements: {
#         'x-amz-request-id': '5MF14MW8YP1W7GAH',
#         'x-amz-id-2': 'ZdC/4TCIbQmgHUzC4rpdj5C+MjxjXYPQusLkueEQon49x4iZ5P4cbFtQjaRy3VYgtSY1mB7c/nSBRZCap63YVby2r7Felfwk'
#       },
#       s3: {
#         s3SchemaVersion: '1.0',
#         configurationId: 'arn:aws:cloudformation:eu-central-1:013990830057:stack/dev-cognito-triggers-blog-rekognition/b11ec250-4c6e-11ed-a904-06f93fa4dbae-6371439725766036361',
#         bucket: {
#           name: 'dev-cognito-triggers-blog-users-bucket',
#           ownerIdentity: { principalId: 'A3QXWNAPU934VH' },
#           arn: 'arn:aws:s3:::dev-cognito-triggers-blog-users-bucket'
#         },
#         object: {
#           key: 'private/eu-central-1%3A96d6db99-7551-48b5-be69-a608c5e306b7/8c4786c3-0cdf-4ed3-821c-aaa5e728ec8c.jpeg',
#           size: 0,
#           eTag: 'd41d8cd98f00b204e9800998ecf8427e',
#           sequencer: '00634A84B6C8A82C47'
#         }
#       }
#     }
#   ]
# }
