import React, { Component } from "react";
import Webcam from "react-webcam";
import {
  Button,
} from '@mui/material';
import { Storage } from 'aws-amplify';

const videoConstraints = {
  height: 1080,
  width: 1920,
  facingMode: "user"
};

class Camera extends Component {
  constructor(props) {
    super(props);
    this.webcamRef = React.createRef();
  }

  state = {
    url: null
  };

  componentDidMount() {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "camera" })
        .then((permissionObj) => {
          if (permissionObj.state !== "granted") {
            alert("Please allow camera permission");
          }
          console.log(permissionObj.state);
        })
        .catch((error) => {
          console.log("Got error :", error);
        });
    }
  }

  capturePhoto = async () => {
    const imageSrc = this.webcamRef.current.getScreenshot();
    this.setState({ url: imageSrc });
    console.log(imageSrc)
    const response = await fetch(imageSrc)
    console.log(response)
    const blob = await response.blob()
    console.log(blob)

    try {
      const result = await Storage.put("signup/test.jpeg", blob, {
        level: "private",
        contentType: "image/jpeg",
      });
      console.log(result);
    } catch (e) {
      console.error(e)
    }
  };

  render() {
    return (
      <>
        <div className="Camera">
          <Webcam
            ref={this.webcamRef}
            audio={false}
            screenshotQuality={1}
            forceScreenshotSourceSize
            screenshotFormat="image/jpeg" //"image/png"
            videoConstraints={videoConstraints}
            height="288px" // size of displaying screen
            width="512px" // size of displaying screen
          />
          <Button onClick={this.capturePhoto} variant="contained">Capture</Button>
          {this.state.url ? (
            <div id="image">
              <img
                style={{ height: "288px", width: "512px" }}
                src={this.state.url} //show pic in state
                alt="Screenshot"
              />
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

export default Camera;
