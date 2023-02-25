# How to deploy

* Change cdk.context.json account and region
* Change cdk.json context variables
* npm install
* npm run deploy (be sure to check your email and validate your SES identity)

# How to run react application

* cd frontend
* npm install -g @aws-amplify/cli
* npm install
* amplify init
* amplify import auth (select custom-client)
* amplify import storage (select dev-triggers-blog-users-bucket)
* amplify push
* npm start

# How to test the backend, locally

* cd test
* npm install
* set environments:
  * POWERSHELL:
  ```
  $env:COGNITO_CLIENT_ID = 'YOUR_COGNITO_CLIENT_ID'
  $env:USER_EMAIL = 'YOUR_USER_EMAIL'
  $env:USER_CONFIRMATION_CODE = 'YOUR_USER_CONFIRMATION_CODE'
  $env:USER_PHONE_NUMBER = 'YOUR_USER_PHONE_NUMBER'
  $env:OLD_COGNITO_CLIENT_ID = 'YOUR_OLD_COGNITO_CLIENT_ID'
  ```
  
  * LINUX:
  ```
  export COGNITO_CLIENT_ID = 'YOUR_COGNITO_CLIENT_ID'
  export USER_EMAIL = 'YOUR_USER_EMAIL'
  export USER_CONFIRMATION_CODE = 'YOUR_USER_CONFIRMATION_CODE'
  export USER_PHONE_NUMBER = 'YOUR_USER_PHONE_NUMBER'
  export OLD_COGNITO_CLIENT_ID = 'YOUR_OLD_COGNITO_CLIENT_ID'
  ```

* node crete-user.js
* set USER_CONFIRMATION_CODE env
* node confirm-user.js
* node initiate-auth.js
* node migrate-user.js

# How to delete everything

* cd frontend
* amplify delete
* cd ..
* npm run destroy
