import { Box, Input } from "@mui/material";
import { useState, useRef } from "react";
import { Auth } from "aws-amplify";
import Webcam from 'react-webcam';
import cameraFunctions from "../shared/CameraFunctions";
import Button from '../modules/components/Button';

export default function SignIn() {
  const [username, setUsername] = useState<string>('');
  const [challengeRequest, setchallengeRequest] = useState<any>(null);
  const [state, setState] = useState<string>("SignIn");
  const [cameraUrl, setCameraUrl] = useState<string | null>('');
  const [cameraFile, setCameraFile] = useState<File | undefined>(undefined);
  const cameraRef = useRef<Webcam>(null);

  const handleSignIn = async () => {
    try {
      const cognitoUser = await Auth.signIn(username);

      if (cognitoUser.challengeName === 'CUSTOM_CHALLENGE') {
        setState("CustomChallenge");
        setchallengeRequest(cognitoUser);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const capturePhoto = () => {
    const imgSrc = cameraFunctions.capturePhoto(cameraRef);
    setCameraUrl(imgSrc);
    const file = cameraFunctions.dataURLtoFile(imgSrc, "test.jpeg");
    setCameraFile(file);
  }

  const challengeResponse = async (answer: string) => {
    const cognitoUser = await Auth.sendCustomChallengeAnswer(challengeRequest, answer);

    if (cognitoUser.authenticationFlowType !== 'CUSTOM_AUTH') {
      setState("Success");
    } else {
      setState("CustomChallenge");
      setchallengeRequest(cognitoUser);
      setCameraUrl(null);
      setCameraFile(undefined);
    }
  }

  const submitPhoto = async () => {
    try {
      await fetch(challengeRequest.challengeParam.presignedUrl, {
        method: "PUT",
        body: cameraFile,
      });
      await challengeResponse(challengeRequest.challengeParam.key);
    } catch (e) {
      console.error(e);
    }
  };

  const videoConstraints = {
    height: 1080,
    width: 1920,
    facingMode: 'user'
  };

  return (state === "SignIn" ? (
    <Box
      sx={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
        marginBottom: 10,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 2,
        }}>
        <Input
          type="text"
          name="username"
          value={username}
          placeholder="Email"
          onChange={(event) => setUsername(event.target.value)}
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Button
          type="button"
          onClick={() => handleSignIn()}
          variant="contained"
        >
          SignIn
        </Button>
      </Box>
    </Box >
  ) : state === 'CustomChallenge' ? (
    <Box
      sx={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 2,
        }}>
        <Webcam
          ref={cameraRef}
          audio={false}
          screenshotQuality={1}
          forceScreenshotSourceSize
          screenshotFormat="image/jpeg" //'image/png'
          videoConstraints={videoConstraints}
          height="288px" // size of displaying screen
          width="512px" // size of displaying screen
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 2,
        }}>
        <Button type="button" onClick={() => capturePhoto()} variant="contained">
          Capture
        </Button>
      </Box>
      {cameraUrl ? (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 2,
          }}>
          <div id="image">
            <img
              style={{ height: "288px", width: "512px" }}
              src={cameraUrl} //show pic in state
              alt="Screenshot"
            />
          </div>
        </Box>
      ) : null
      }
      {
        cameraUrl ? (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 2,
            }}>
            <Button type="button" onClick={() => submitPhoto()} variant="contained">
              SUBMIT PHOTO
            </Button>
          </Box >
        ) : null
      }
    </Box >
  ) : state === "Success" ? (
    <Box
      sx={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <h1> Hey you signed in successfully! </h1>
    </Box>
  ) : null
  );
}
