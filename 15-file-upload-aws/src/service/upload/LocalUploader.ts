import fs from "fs";
import { finished } from "stream/promises";
import {
  SingleFile,
  Uploader,
  UploadFile,
  UploadedFileResponse,
  VAILD_IMAGE_MIME,
} from "./Uploader";

export class LocalUploader extends Uploader {
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

  async singleFileUploadResolver(
    parent,
    file: Promise<UploadFile>
  ): Promise<UploadedFileResponse> {
    const { createReadStream, filename, mimetype, encoding } = await file;
    this.validateFile({ filename, mimetype, encoding });

    const stream = createReadStream();

    // Create the destination file path
    const filePath = this.createDestinationFilePath(
      filename,
      mimetype,
      encoding
    );

    const out = fs.createWriteStream(filePath);
    stream.pipe(out);
    await finished(out);
    return { filename, mimetype, encoding, url: filePath };
  }

  async singleResizeFileUploadResolver(
    parent,
    file: Promise<UploadFile>
  ): Promise<UploadedFileResponse> {
    const { createReadStream, filename, mimetype, encoding } = await file;
    this.validateFile({ filename, mimetype, encoding });

    const stream = createReadStream();
    const filePath = this.createDestinationFilePath(
      filename,
      mimetype,
      encoding
    );

    const out = fs.createWriteStream(filePath);
    this.resizeStream(stream, out, { width: 200, height: 200 });

    await finished(out);
    return { filename, mimetype, encoding, url: filePath };
  }
}
