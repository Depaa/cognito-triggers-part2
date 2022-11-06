const { Rekognition } = require('aws-sdk');

const rekognition = new Rekognition();

exports.handler = async (event) => {
  console.debug(JSON.stringify(event));
  event.response.answerCorrect = false;

  const params = {
    CollectionId: process.env.COLLECTION_ID,
    Image: {
      S3Object: {
        Bucket: process.env.USERS_BUCKET,
        Name: event.request.challengeAnswer,
      }
    },
    MaxFaces: 1,
    FaceMatchThreshold: 95
  };

  try {
    const res = await rekognition.searchFacesByImage(params).promise();
    console.debug(JSON.stringify(res));

    for(const match of res.FaceMatches) {
      if(event.request.privateChallengeParameters.answer === match.Face.FaceId) {
        event.response.answerCorrect = true;
      }
    }
  } catch (error) {
    console.error(error);
  }
  return event;
}