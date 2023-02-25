const { DynamoDB, Rekognition } = require('aws-sdk');

const dynamodb = new DynamoDB.DocumentClient();
const rekognition = new Rekognition();

exports.handler = async (event) => {
  for (const record of event.Records) {
    const key = decodeURIComponent(record.s3.object.key);
    const bucketName = record.s3.bucket.name;
    const sub = key.split('/')[2].replace(`.jpeg`, '');

    const params = {
      CollectionId: process.env.COLLECTION_ID,
      ExternalImageId: sub,
      Image: {
        S3Object: {
          Bucket: bucketName,
          Name: key
        }
      },
      MaxFaces: 1
    }
    console.debug(params);

    try {
      const indexRes = await rekognition.indexFaces(params).promise();
      console.info(`Successfully indexed face for user ${sub}`);
      console.info(`${sub} confidence is: ${indexRes.FaceRecords[0].Face.Confidence}`);
      console.debug(JSON.stringify(indexRes));

      const indexParams = {
        TableName: process.env.USERS_TABLE,
        Key: {
          id: sub,
        },
        UpdateExpression: `set #f = :f`,
        ExpressionAttributeNames: { '#f': 'faceId' },
        ExpressionAttributeValues: {
          ':f': indexRes.FaceRecords[0].Face.FaceId,
        },
        ReturnValues: 'UPDATED_NEW',
      };
      await dynamodb.update(indexParams).promise();
      console.info(`Successfully update user ${sub}`);
    } catch (e) {
      console.error(e)
    }
  }

  return event;
}
