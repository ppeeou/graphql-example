import { gql, UserInputError } from "apollo-server";
import { GraphQLUpload } from "graphql-upload";
import path from "path";
import fs from "fs";
import { finished } from "stream/promises";
import mime from "mime-types";

export const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Mutation {
    singleUpload(file: Upload!): File!
  }

  type Query {
    otherFields: Boolean!
  }
`;

export const resolvers = {
  Upload: GraphQLUpload,

  Mutation: {
    singleUpload: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      // Invoking the `createReadStream` will return a Readable Stream.
      // See https://nodejs.org/api/stream.html#stream_readable_streams
      const stream = createReadStream();
      const ext = mime.extension(mimetype);

      if (ext !== "jpeg") {
        throw new UserInputError("only jpeg");
      }

      const basename = path.parse(filename).name;
      const out = fs.createWriteStream(`${basename}.${ext}`);
      stream.pipe(out);
      await finished(out);
      return { filename, mimetype, encoding };
    },
  },

  Query: {
    otherFields: (parent, args) => {
      return false;
    },
  },
};
