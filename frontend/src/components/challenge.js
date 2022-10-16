import React, { Component } from 'react';
import Webcam from 'react-webcam';
import {
  Button,
} from '@mui/material';
import { Storage, Auth } from 'aws-amplify';

const videoConstraints = {
  height: 1080,
  width: 1920,
  facingMode: 'user'
};

export default class Challenge extends Component {
  constructor(props) {
    super(props);
    this.webcamRef = React.createRef();
  }

  state = {
    url: null,
    file: null,
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
    console.log("CAMERA", this.props);
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


  submitPhoto = async () => {
    try {
      const answer = 'b4b79d97-0a36-48d3-9b88-e31d52628a88';
      const presignedUrl = 'https://dev-cognito-triggers-blog-users-bucket.s3.eu-central-1.amazonaws.com/signin/b4b79d97-0a36-48d3-9b88-e31d52628a88/187167be-7cfd-4848-97c7-c3bb7666028d.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQGQPLD7U5DMBVT6O%2F20221016%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20221016T115432Z&X-Amz-Expires=600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaDGV1LWNlbnRyYWwtMSJHMEUCIQDKAcxpXZHppUQYV6jNNT02Mobd1yh6HtkILAoe0XwE4gIgCJFapGV5C3Hh818PBD%2FqucDM6%2BZ0BgiV5qCz4sQA8OQqvwMI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwwMTM5OTA4MzAwNTciDMk8CK9JjtxcGKSwQCqTAyAmxXgmCFxNLHYl0b3o4BQgWsGM3PRp06NsA3HMIdzH6c2feUf9CIOgggDBLiw%2BMhxZScWEXAq4ZjeEhOqTgh5Q9Y7hjUJ57WcpldWVMSc2%2Bd9wuWISahLdKGg1Y%2FTrstRvKn05jBRLCFRkzEmBsApYwo49AR%2BQNr20lUyQY3G0JDIiKOTG7H5QcJffzC8Fsx9S6DycUAT8ssVhSsqIrRG7FpazkCnyU5wBj%2FXn4nJKRCk4AotvELwZmdMkrGD7eY25YN%2Bo86IO25XVYm6RhZL2XfGjL25xkqnOcFRTofDrF%2B6ruL6buWcTB4ztsbY4jAV%2F9IJM%2FwLps61o1X9SjPSmp%2FMvuGE85qQIJPIz%2BkefIPLKK2Zv6DBwl2fk3wvvM%2F32n7yeXX8d%2FEGfyT8DZ7ZoMm8DYGoKSZ8uZNdwIq6fcmXUOe9aH2PxJvV7kUYHuSh6IvXcOummYuOoqlee6iW9%2F4wxhFep9r5Pnaz07R9DFK1SsLB%2FwYeDfkB8wrbFql5En3S2zdTvQykii5%2BBPxOAeSIw9uGvmgY6ngHwuUc5v%2FHKEnxoGUAnPRpyFsJl6kI502GmsPqFBPBsX4NlzKarKH67OzmHxXtZWZVV%2BRVLnxDfxdtEcy%2FYUjK9yfeOaHyALaPUM3oNIXUMvqDE6JAPcRO3TErfQwHCvOKe3fX%2FkV87FCl3J2Pr0EFPjzSWcdImZWNFuN%2BQl7G47MYDU0zUUG9xuyTRlJO1mXeGkkDX2NeVDDSAsxrAdg%3D%3D&X-Amz-Signature=695a4b8152d336e53efddc993470046ae4ee412fd34aba4a2ad6b6f64bd425b9&X-Amz-SignedHeaders=host';

      // const body = new FormData();
      // body.append('file', this.state.file);
      // const response = await fetch(presignedUrl, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data', //this.state.file.type //'image/jpeg'//'multipart/form-data',
      //   },
      //   method: 'PUT',
      //   body: body,
      // });
      // console.log(response)
      // console.log(this.state.file);

      const res = await fetch(presignedUrl, {
        method: "PUT",
        body: this.state.file,
      });
      console.log(res);

      // const res = await fetch(presignedUrl, {
      //   method: "PUT",
      //   body: await this.getBlob(this.state.url),
      // });
      // console.log(res);

      // const user = await Auth.sendCustomChallengeAnswer(cognitoUser, answer);
      // console.log("CUSTOM_CHALLENGE", user);

      // const auth = await Auth.currentSession();
      // console.log(auth)

      // const result = await Storage.put(id + '.jpeg', this.state.file, {
      //   level: 'private',
      //   contentType: 'image/jpeg',
      // });
      // console.log(result);
      // console.log(this.props);
      // this.props.switchComponent('Success');
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