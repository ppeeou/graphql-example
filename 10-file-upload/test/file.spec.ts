import * as fs from "fs";
import path from "path";
import { gql } from "apollo-server-core";
import { getApolloServer } from "../src/server";
import { Upload } from "graphql-upload";

const { server } = getApolloServer();

describe("file-upload", function () {
  beforeAll(async function () {
    await server.start();
  });

  it("upload", async function () {
    const QUERY = gql`
      mutation ($file: Upload!) {
        singleUpload(file: $file) {
          filename
          encoding
          mimetype
        }
      }
    `;

    const filePath = path.join(__dirname, "../", "assets", "image.jpg");
    const upload = new Upload();

    upload.resolve({
      createReadStream: () => fs.createReadStream(filePath),
      encoding: "utf8",
      filename: "good.jpg",
      mimetype: "image/jpeg",
    });

    const result = await server.executeOperation({
      query: QUERY,
      variables: {
        file: upload,
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.singleUpload.filename).toBe("good.jpg");
  });
});
