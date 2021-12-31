import AWS from "aws-sdk";
import stream from "stream";
import {
  SingleFile,
  UploadedFileResponse,
  Uploader,
  UploadFile,
  VAILD_IMAGE_MIME,
} from "./Uploader";

type S3UploadConfig = {
  AWS_ACCESSKEYID: string;
  AWS_SECRET_ACESSKEY: string;
  AWS_S3_DESTINATION_BUCKETNAME: string;
  REGION?: string;
};

type S3UploadStream = {
  writeStream: stream.PassThrough;
  promise: Promise<AWS.S3.ManagedUpload.SendData>;
};

export class AWSS3Uploader extends Uploader {
  private s3: AWS.S3;
  config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    super();
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: config.REGION || "ca-central-1",
      accessKeyId: config.AWS_ACCESSKEYID,
      secretAccessKey: config.AWS_SECRET_ACESSKEY,
    });

    this.s3 = new AWS.S3();
    this.config = config;
  }

  private createDestinationFilePath(
    fileName: string,
    mimetype: string,
    encoding: string
  ): string {
    return fileName;
  }

  validateFile(file: SingleFile) {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types
    if (VAILD_IMAGE_MIME.includes(file.mimetype)) {
      return;
    }

    throw new TypeError("invaild mime type");
  }

  private createUploadStream(key: string, mimetype: string): S3UploadStream {
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: this.s3
        .upload({
          Bucket: this.config.AWS_S3_DESTINATION_BUCKETNAME,
          Key: key,
          Body: pass,
          ContentType: mimetype,
        })
        .promise(),
    };
  }

  async uploadStream() {}

  async singleFileUploadResolver(
    parent,
    file: Promise<UploadFile>
  ): Promise<UploadedFileResponse> {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const stream = createReadStream();

    const filePath = this.createDestinationFilePath(
      filename,
      mimetype,
      encoding
    );

    const uploadStream = this.createUploadStream(filePath, mimetype);
    stream?.pipe(uploadStream.writeStream);

    // Start the stream
    const result = await uploadStream.promise;
    const link = result.Location;

    return { filename, mimetype, encoding, url: link };
  }

  async singleResizeFileUploadResolver(
    parent,
    file: Promise<UploadFile>
  ): Promise<UploadedFileResponse> {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const stream = createReadStream();

    const filePath = this.createDestinationFilePath(
      filename,
      mimetype,
      encoding
    );

    const uploadStream = this.createUploadStream(filePath, mimetype);

    this.resizeStream(stream, uploadStream.writeStream, {
      width: 300,
      height: 300,
    });

    // Start the stream
    const result = await uploadStream.promise;
    const link = result.Location;

    return { filename, mimetype, encoding, url: link };
  }
}
