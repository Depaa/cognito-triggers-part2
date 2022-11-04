import { RefObject } from "react";
import Webcam from "react-webcam";

const cameraFunctions = {
  capturePhoto: (webcamRef: RefObject<Webcam>) => {
    const imageSrc = webcamRef!.current!.getScreenshot();
    return imageSrc;
  },
  dataURLtoFile: (dataurl: string | null, filename: string) => {
    if (dataurl !== null) {
      const arr = dataurl.split(",");
      let mime: any;
      const mimeTemp = arr[0].match(/:(.*?);/);
      if (mimeTemp) mime = mimeTemp[1];
      const bstr = atob(arr[1]);
      let n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
  },
};

export default cameraFunctions;
