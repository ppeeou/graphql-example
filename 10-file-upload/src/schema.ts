import { gql } from "apollo-server";
import { GraphQLUpload } from "graphql-upload";
import fs from "fs";
import { finished } from "stream/promises";

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

      // This is purely for demonstration purposes and will overwrite the
      // local-file-output.txt in the current working directory on EACH upload.
      const out = fs.createWriteStream("local-file-output.txt");

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
