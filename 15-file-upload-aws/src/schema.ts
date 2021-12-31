import { gql } from "apollo-server";
import { GraphQLUpload } from "graphql-upload";
import { Uploader } from "./service/upload";

export const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  type Mutation {
    singleUpload(file: Upload!): File!
    singleResizeUpload(file: Upload!): File!
  }

  type Query {
    _empty: String
  }
`;

export const resolvers = {
  Upload: GraphQLUpload,

  Mutation: {
    singleUpload: async (
      parent,
      { file },
      { uploadService }: { uploadService: Uploader }
    ) => {
      return uploadService.singleFileUploadResolver(parent, file);
    },

    singleResizeUpload: async (
      parent,
      { file },
      { uploadService }: { uploadService: Uploader }
    ) => {
      return uploadService.singleResizeFileUploadResolver(parent, file);
    },
  },
};
