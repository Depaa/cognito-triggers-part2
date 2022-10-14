import { Storage } from 'aws-amplify';

async function uploadFile() {
  const result = await Storage.put("test.txt", "Private Content", {
    level: "private",
    contentType: "text/plain",
  });
}


async function onChange(e) {
  const file = e.target.files[0];
  try {
    await Storage.put(file.name, file, {
      contentType: "image/png", // contentType is optional
    });
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
}