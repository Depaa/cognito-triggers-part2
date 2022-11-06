import { Box, Input } from '@mui/material';
import { Storage, Auth } from 'aws-amplify';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import cameraFunctions from '../shared/CameraFunctions';
import Button from '../modules/components/Button';

export default function SignUp() {
  const [username, setUsername] = useState<string>('');
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [state, setState] = useState<string>('SignUp');
  const [cameraUrl, setCameraUrl] = useState<string | null>('');

  const [cameraFile, setCameraFile] = useState<File | undefined>(undefined);
  const cameraRef = useRef<Webcam>(null);

  const handleSignUp = async () => {
    try {
      await Auth.signUp({
        username,
        password: `zZ8${Math.random().toString(36).slice(-8)}!`,
        attributes: { email: username, },
        autoSignIn: { enabled: true, },
      });
      setState('Verify');
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerification = async () => {
    try {
      await Auth.confirmSignUp(username, verifyCode);
      setState('Camera');
    } catch (e) {
      console.error(e);
    }
  };

  const capturePhoto = () => {
    const imgSrc = cameraFunctions.capturePhoto(cameraRef);

    const file = cameraFunctions.dataURLtoFile(imgSrc, 'test.jpeg');

    setCameraFile(file);
    setCameraUrl(imgSrc);
  }

  const submitPhoto = async () => {
    try {
      const auth = await Auth.currentAuthenticatedUser({
        bypassCache: false
      });
      const id = auth.username;

      await Storage.put(id + '.jpeg', cameraFile, {
        //! private means /private/eu-central-1:not_sub/file_name
        //! not private means /public/file_name
        level: 'private',
        contentType: 'image/jpeg',
      });
      setState('Success');
    } catch (e) {
      console.error(e);
    }

  };

  const videoConstraints = {
    height: 1080,
    width: 1920,
    facingMode: 'user'
  };

  return state === 'SignUp' ? (
    <Box
      sx={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 10,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 2,

        }}>
        <Input
          type='text'
          name='username'
          value={username}
          placeholder='Email'
          onChange={(event) => setUsername(event.target.value)}
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          type='button'
          onClick={() => handleSignUp()}
          variant='contained'
        >
          SignUp
        </Button>
      </Box>
    </Box >
  ) : state === 'Verify' ? (
    <Box
      sx={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 10,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 2,
        }}>
        <Input
          type='text'
          name='code'
          value={verifyCode}
          placeholder='Verification Code'
          onChange={(event) => setVerifyCode(event.target.value)}
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 2,
        }}>
        <Button
          type='button'
          onClick={() => handleVerification()}
          variant='contained'
        >
          CONFIRM
        </Button>
      </Box>
    </Box >
  ) : state === 'Camera' ? (
    <Box
      sx={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 2,
        }}>
        <Webcam
          ref={cameraRef}
          audio={false}
          screenshotQuality={1}
          forceScreenshotSourceSize
          screenshotFormat='image/jpeg' //'image/png'
          videoConstraints={videoConstraints}
          height='288px' // size of displaying screen
          width='512px' // size of displaying screen
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 2,
        }}>
        <Button type='button' onClick={() => capturePhoto()} variant='contained'>
          Capture
        </Button>
      </Box>
      {cameraUrl ? (
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 2,
          }}>
          <div id='image'>
            <img
              style={{ height: '288px', width: '512px' }}
              src={cameraUrl} //show pic in state
              alt='Screenshot'
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
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2,
            }}>
            <Button type='button' onClick={() => submitPhoto()} variant='contained'>
              SUBMIT PHOTO
            </Button>
          </Box >
        ) : null
      }
    </Box >
  ) : state === 'Success' ? (
    <Box
      sx={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <h1> Hey you signed up successfully! </h1>
    </Box>
  ) : null
}
