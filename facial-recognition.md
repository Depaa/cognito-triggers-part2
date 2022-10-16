1. registrazione su cognito
    - registrazione su cognito
    - inserimento di una foto su s3
        - api per presigned url oppure premessi sul singolo utente
3. login con cognito 
    - inserire una foto su s3
    - login su cognito con custom challenge
            

WHAT AM I DOING:
- google: getting started with reactjs
- npx create-react-app cognito-facial-recognition
- amplify init 
- create identity pool cognito
- amplify signup/signin
- signup with verification email
- signin very important to have only custom and userSrp ---> to check the last one



WHAT I EXPECT TO DO:
- registro l'email e non la password (password generata in automatico)
- durante la registrazione viene fatto un upload dello screenshot dalla camera
    -> bucket con policy che fa allow su utenti non registrati
- Facoltativo: se non viene fatto l'upload dell'immaigne allora dev'essere richiesto al primo accesso
- Utente inserisce l'email -> richiesta a cognito
    -> invocata la create auth challenge

    -> invocata la define auth challenge
        -> utente inserisce immagine su s3
    -> invocata la verify