import React, { Component } from 'react';
import Webcam from 'react-webcam';
import {
  Button,
} from '@mui/material';
import { Storage } from 'aws-amplify';

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

  componentDidMount() {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'camera' })
        .then((permissionObj) => {
          if (permissionObj.state !== 'granted') {
            alert('Please allow camera permission');
          }
          console.log(permissionObj.state);
        })
        .catch((error) => {
          console.log('Got error :', error);
        });
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
    console.log(this.props);
    // code:"817839"
    // email:"myemail"
    // file:null
    // password:"pswBLOG2022?"
    // status    :"Camera"
    // sub:""
    // user    :    null
    // username:""
    const imageSrc = this.webcamRef.current.getScreenshot();
    const file = this.dataURLtoFile(imageSrc, 'test.jpeg');
    this.setState({ file: file });
  }

  submitPhoto = async () => {
    try {
      const result = await Storage.put(this.props.sub, this.file, {
        level: 'private',
        contentType: 'image/jpeg',
      });
      console.log(result);
      this.props.switchComponent('SignIn');
    } catch (e) {
      console.error(e)
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
          {this.props.file ? (
            <div id='image'>
              <img
                style={{ height: '288px', width: '512px' }}
                src={this.props.file} //show pic in state
                alt='Screenshot'
              />
            </div>
          ) : null}
          {this.props.file ? (<Button type='button' onClick={this.submitPhoto} variant='contained'>SUBMIT PHOTO</Button>) : null}
        </div>
      </>
    );
  }
}