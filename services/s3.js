import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import * as fs from 'fs';

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

  // Upload File to S3
  const uploadFile = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
  })

  // Download File from S3
   const downloadFile = async (filename) => {
    try {
      const res = await s3.getObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
      return { success: true, data: fs.writeFileSync('/ubuntu/temp/' + filename, res.Body) }
    } catch(error) {
      return { success: false, data: null }
    }
  }

/*   const filePath = './teste.pdf';
  const downloadFile = (filePath, BUCKET_NAME, filename) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: filename
  };
  s3.getObject(params, (err, data) => {
    if (err) console.error(err);
    fs.writeFileSync(filePath, data.Body.toString());
    console.log(`${filePath} has been created!`);
  }); 
};*/


  
  // Delete File from S3
  const deleteFile = async (filename) => {
    try {
      await s3.deleteObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
      return { success: true, data: "Arquivo excluído com sucesso!!!" }
    } catch(error) {
      return { success: false, data: null }
    }
  }
    
  // List All Files Names from S3
  const listFiles = async () => {
    try {
      const files = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise();
      const names = files.Contents.map(file => file.Key)
      return { success: true, data: names }
    } catch(error) {
      return { success: false, data: null }
    }
  }

export {
  uploadFile,
  downloadFile,
  deleteFile,
  listFiles
}
