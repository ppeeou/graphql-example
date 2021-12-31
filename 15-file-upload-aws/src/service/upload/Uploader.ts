import gm from "gm";

export type SingleFile = {
  filename: string;
  mimetype: string;
  encoding: string;
};

export type UploadFile = {
  createReadStream: () => NodeJS.ReadStream;
} & SingleFile;

export type UploadedFileResponse = {
  filename: string;
  mimetype: string;
  encoding: string;
  url: string;
};

export abstract class Uploader {
  validateFile(file: SingleFile) {
    throw new Error("implement function");
  }

  singleFileUploadResolver(
    parent,
    file: Promise<UploadFile>
  ): Promise<UploadedFileResponse> {
    throw new Error("implement function");
  }

  singleResizeFileUploadResolver(
    parent,
    file: Promise<UploadFile>
  ): Promise<UploadedFileResponse> {
    throw new Error("implement function");
  }

  resizeStream(
    readStream: NodeJS.ReadStream,
    writeStream: NodeJS.WritableStream,
    options: { width: number; height: number }
  ) {
    const { width, height } = options;
    gm(readStream)
      .resize(width, height)
      .stream() //
      .pipe(writeStream);
  }
}

export const VAILD_IMAGE_MIME = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
];
