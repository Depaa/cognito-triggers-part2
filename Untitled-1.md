1. 
    command: `aws cognito-idp sign-up --client-id '37oqt74v6k1q5qt8paiq4fomji' --username 'depascale.matteo+blogtest1@gmail.com' --password 'Password1!' --user-attributes Name='phone_number',Value='+14047772839' --profile personal --region eu-central-1`
    result: 
        - custom message
        - pre-signup -> send-reminder -> delete-user
2. 
    command: `aws cognito-idp confirm-sign-up --client-id '37oqt74v6k1q5qt8paiq4fomji' --username 'depascale.matteo+blogtest1@gmail.com' --confirmation-code '075360' --profile personal --region eu-central-1`
    result:
        - post-confirmation -> should delete step function execution
3. 
    command: `aws cognito-idp initiate-auth --client-id '37oqt74v6k1q5qt8paiq4fomji' --auth-flow 'USER_PASSWORD_AUTH'  --auth-parameters USERNAME='depascale.matteo+blogtest1@gmail.com',PASSWORD='Password1!'  --profile personal --region eu-central-1`
    result:
        - pre-authentication
        - post-authentication
        - pre-token-generation
4. 
    command: `aws cognito-idp admin-disable-user --user-pool-id 'eu-central-1_aqo2lvMzN' --username '3d192e68-0263-4bc7-acc8-801e8c445e46' --profile personal --region eu-central-1`
5. 
    command: `aws cognito-idp admin-delete-user --user-pool-id 'eu-central-1_aqo2lvMzN' --username '3d192e68-0263-4bc7-acc8-801e8c445e46' --profile personal --region eu-central-1`

------------------------
1.     
    command: `aws cognito-idp initiate-auth --client-id '37oqt74v6k1q5qt8paiq4fomji' --auth-flow 'USER_PASSWORD_AUTH'  --auth-parameters USERNAME='depascale.matteo+blogtest1@gmail.com',PASSWORD='Password1!'  --profile personal --region eu-central-1`
    result:
        - migrate-user
        - pre-signup -> send-reminder -> delete-user
        - pre-authentication
        - post-authentication
        - pre-token-generation 