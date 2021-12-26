import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { String } from 'aws-sdk/clients/cloudsearch'
// const XAWS = AWSXRay.captureAWS(AWS)

// TODO[DONE]: Implement the fileStorage logic
const urlExpire = process.env.SIGNED_URL_EXPIRATION
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.ATTACHMENT_S3_BUCKET

export async function createUploadPresignedUrl(
  todoId: string
): Promise<String> {
  const uploadUrl = await s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(urlExpire)
  })
  console.log('createUploadPresignedUrl' + uploadUrl)
  return uploadUrl
}
