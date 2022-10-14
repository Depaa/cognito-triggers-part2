import { Auth, Hub } from 'aws-amplify';

async function signUp(password, email) {
  try {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        // phone_number,
      },
      autoSignIn: {
        enabled: true,
      }
    });
    console.log(user);
  } catch (error) {
    console.log('error signing up:', error);
  }
}

function listenToAutoSignInEvent() {
  Hub.listen('auth', ({ payload }) => {
    const { event } = payload;
    if (event === 'autoSignIn') {
      const user = payload.data;
      console.log(user);
      // assign user
    } else if (event === 'autoSignIn_failure') {
      // redirect to sign in page
    }
  })
}

async function confirmSignUp(username, code) {
  try {
    await Auth.confirmSignUp(username, code);
  } catch (error) {
    console.log('error confirming sign up', error);
  }
}

async function resendConfirmationCode(username) {
  try {
    await Auth.resendSignUp(username);
    console.log('code resent successfully');
  } catch (err) {
    console.log('error resending code: ', err);
  }
}

async function signIn(username, password) {
  try {
    const user = await Auth.signIn(username, password);
    console.log(user);
  } catch (error) {
    console.log('error signing in', error);
  }
}

async function signOut() {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log('error signing out: ', error);
  }
}

async function currentAuthenticatedUser() {
  try {
    const auth = Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    console.log(auth)
  } catch (e) {
    console.log('error currentAuthenticatedUser: ', error);

  }
}