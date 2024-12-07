import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import * as fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

const bucketName = 'quizzey';
const region = "eu-north-1"; //s3Client.config.region;

// Initialize the S3 client
const s3Client = new S3Client({
  region: "eu-north-1", // e.g., 'us-east-1'
  credentials: {
    accessKeyId: "AKIAX2DZEY757CMFZLGO",
    secretAccessKey: "wUJejmWEDx6aUYbMMY2W/gzv7Fbtl6hL+FYwxrY2",
  },
});

// Function to upload a file to S3 and generate a public URL
export const uploadFileToS3 = async (filePath: string, key: string) => {
    try {
      const fileStream = fs.createReadStream(filePath);
  
      const uploadParams = {
        Bucket: bucketName,
        Key: key, // S3 object key
        Body: fileStream,
      };
  
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
  
      // Use the region from the s3Client configuration
      // Construct the correct public URL
      const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
      //console.log("File uploaded and made public at:", publicUrl);
      return publicUrl;
    } catch (err) {
      console.error("Error uploading file:", err);
      throw err;
    }
  };


// const key = await Utils.generateFileName(req.file); // Destination path in the S3 bucket
// const response = await uploadFileToS3(filePath, key);
// console.log("response result ==================");
// console.log(response);
