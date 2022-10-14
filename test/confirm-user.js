const { CognitoIdentityProviderClient, ConfirmSignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');

const COGNITO_CLIENT_ID = '7vgbpi5q6b5n6h4j802r94tcuj';
const USER_EMAIL = 'depascale.matteo+2@gmail.com';
const USER_CONFIRMATION_CODE = '399856';

const cognito = new CognitoIdentityProviderClient({ region: 'eu-central-1' });

const confirmUser = async () => {
  try {
    const confirmUserCommand = new ConfirmSignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: USER_EMAIL,
      ConfirmationCode: USER_CONFIRMATION_CODE
    });
    const res = await cognito.send(confirmUserCommand);
    console.debug(`Successfully confirmed user`);
  } catch (error) {
    console.error(error);
  }
};

confirmUser();