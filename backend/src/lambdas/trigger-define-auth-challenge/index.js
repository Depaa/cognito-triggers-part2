exports.handler = async (event) => {
  console.debug(JSON.stringify(event));

  event.response.issueTokens = false;
  event.response.failAuthentication = false;
  event.response.challengeName = 'CUSTOM_CHALLENGE';

  if (event.request.session &&
    event.request.session.find(attempt => attempt.challengeName !== 'CUSTOM_CHALLENGE')) {
    event.response.failAuthentication = true;
  } else if (event.request.session && event.request.session.length >= 3 &&
    event.request.session.slice(-1)[0].challengeResult === false) {
    // user answered wrong 3 times in a row
    event.response.failAuthentication = true;
  } else if (event.request.session &&
    event.request.session.length &&
    event.request.session.slice(-1)[0].challengeName === 'CUSTOM_CHALLENGE' &&
    event.request.session.slice(-1)[0].challengeResult === true) {
    event.response.issueTokens = true;
  }
  return event;
}