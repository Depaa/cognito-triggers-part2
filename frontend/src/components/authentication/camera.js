import React, { Component } from 'react';
import Webcam from 'react-webcam';
import {
  Button,
} from '@mui/material';
import { Storage } from 'aws-amplify';
import { v4 } from 'uuid';

const videoConstraints = {
  height: 1080,
  width: 1920,
  facingMode: 'user'
};

export default class Camera extends Component {
  constructor(props) {
    super(props);
    this.webcamRef = React.createRef();
  }

  state = {
    url: null
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

  capturePhoto = async () => {
    console.log(this.props);
    const imageSrc = this.webcamRef.current.getScreenshot();
    this.setState({ url: imageSrc });
    console.log(this.props);
    this.props.switchComponent('Success');
  }

  submitPhoto = async () => {
    try {
      const id = v4();
      const result = await Storage.put(id + '.jpeg', this.url, {
        level: 'private',
        contentType: 'image/jpeg',
      });
      console.log(result);
      console.log(this.props);
      this.props.switchComponent('Success');
    } catch (e) {
      console.error(e);
    }

  };

  render() {
    return (
      <>
        <div className='Camera'>
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
        </div>
      </>
    );
  }
}