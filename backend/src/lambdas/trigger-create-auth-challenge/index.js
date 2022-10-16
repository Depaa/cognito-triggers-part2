const { DynamoDB, S3 } = require('aws-sdk');
const crypto = require('crypto');

const dynamodb = new DynamoDB.DocumentClient();
const s3 = new S3();

exports.handler = async (event) => {
  console.debug(event);

  if (event.request.challengeName === 'CUSTOM_CHALLENGE') {
    const paramsGet = {
      TableName: process.env.USERS_TABLE,
      Key: {
        id: event.request.userAttributes.sub,
      },
      AttributesToGet: ['faceId']
    };
    const result = await dynamodb.get(paramsGet).promise();
    console.debug(result);

    const key = `signin/${event.request.userAttributes.sub}/${crypto.randomUUID()}.jpeg`;
    const presignedUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.USERS_BUCKET,
      Key: key,
      Expires: 60 * 10,
    });

    event.response.publicChallengeParameters = {
      presignedUrl,
      key, 
    };
    event.response.privateChallengeParameters = {
      answer: result.Item.faceId
    };
    event.response.challengeMetadata = 'REKOGNITION_CHALLENGE';
  }
  console.debug(JSON.stringify(event));

  return event;
}