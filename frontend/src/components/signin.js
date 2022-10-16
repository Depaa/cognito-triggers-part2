import React, { Component } from "react";
import { Auth } from "aws-amplify";
import {
  Button,
  Input
} from '@mui/material';
import Webcam from 'react-webcam';

const videoConstraints = {
  height: 1080,
  width: 1920,
  facingMode: 'user'
};

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.webcamRef = React.createRef();
  }

  state = {
    url: null,
    file: null,
    challenge: false,
    challengeReq: {},
    complete: false,
  };

  async componentDidMount() {
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permissions = await navigator.permissions.query({ name: 'camera' })
        if (permissions.state !== 'granted') {
          alert('Please allow camera permission');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  capturePhoto = async () => {
    const imageSrc = this.webcamRef.current.getScreenshot();
    const file = this.dataURLtoFile(imageSrc, 'test.jpeg');
    this.setState({ url: imageSrc, file: file });
  }

  getBlob = async (fileUri) => {
    const resp = await fetch(fileUri);
    const imageBody = await resp.blob();
    console.log(imageBody);
    return imageBody;
  };

  challengeResponse = async (answer) => {
    console.log(answer);
    const cognitoUser = await Auth.sendCustomChallengeAnswer(this.state.challengeReq, answer);
    console.log("CHALLENGE_RES", cognitoUser);

    if (cognitoUser.authenticationFlowType !== 'CUSTOM_AUTH') {
      this.setState({
        challenge: false,
        complete: true,
      });
    } else {
      this.setState({
        challenge: true,
        challengeReq: cognitoUser,
      });
    }
  }

  submitPhoto = async () => {
    try {
      const res = await fetch(this.state.challengeReq.challengeParam.presignedUrl, {
        method: "PUT",
        body: this.state.file,
      });
      console.log(res);

      await this.challengeResponse(this.state.challengeReq.challengeParam.key);
    } catch (e) {
      console.error(e);
    }
  };

  handleSignIn = async event => {
    event.preventDefault();
    const { username } = this.props.inputs;

    const cognitoUser = await Auth.signIn({ username })
    console.log("SIGNIN", cognitoUser);

    if (cognitoUser.challengeName === 'CUSTOM_CHALLENGE') {
      this.setState({
        challenge: true,
        challengeReq: cognitoUser,
      });
    }
  };

  render() {
    return (
      <>
        {!this.state.challenge && !this.state.complete ? (<div className="login">
          <form className="form">
            <Input
              type="text"
              name="username"
              value={this.props.username}
              placeholder="Email"
              onChange={this.props.handleFormInput}
              variant="filled"
            />
            <Button type="button" onClick={this.handleSignIn} variant="contained">SignIn</Button>
          </form>
        </div>) : null}
        {this.state.challenge ?
          (<div className='Camera'>
            <Webcam
              ref={this.webcamRef}
              audio={false}
              screenshotQuality={1}
              forceScreenshotSourceSize
              screenshotFormat='image/jpeg' //'image/png'
              videoConstraints={videoConstraints}
              height='288px' // size of displaying screen
              width='512px' // size of displaying screen
            />
            <Button type='button' onClick={this.capturePhoto} variant='contained'>Capture</Button>
            {this.state.url ? (
              <div id='image'>
                <img
                  style={{ height: '288px', width: '512px' }}
                  src={this.state.url} //show pic in state
                  alt='Screenshot'
                />
              </div>
            ) : null}
            {this.state.url ? (<Button type='button' onClick={this.submitPhoto} variant='contained'>SUBMIT PHOTO</Button>) : null}
          </div>) : null}
        {this.state.complete ? (<h1>Complimenti sei riuscito ad autenticarti</h1>) : null}
      </>
    );
  }
}