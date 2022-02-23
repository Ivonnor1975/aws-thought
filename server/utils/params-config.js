const { v4: uuidv4 } = require('uuid');


const params = fileName => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];
    const imageParams = {
      Bucket: 'user-images-af8a4890-4cd9-48ba-bfe6-4d380fbdce9f',
      Key: `${uuidv4()}.${fileType}`,
      Body: fileName.buffer,
      ACL: 'public-read' // allow read access to this file
    };
    return imageParams;
  };

  module.exports = params;