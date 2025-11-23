import AWS from 'aws-sdk';

const s3 = new AWS.S3({ signatureVersion: 'v4' });
const bucketName = process.env.ATTACHMENTS_S3_BUCKET;
const urlExpiration = parseInt(process.env.URL_EXPIRATION || '300', 10);


export async function getUploadUrl(todoId) {
  const params = {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration,
    ContentType: 'image/*'
  };


  return s3.getSignedUrlPromise('putObject', params);
}


export function getAttachmentUrl(todoId) {
  return `https://${bucketName}.s3.amazonaws.com/${todoId}`;
}
