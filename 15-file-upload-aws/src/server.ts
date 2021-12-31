require("dotenv").config();

import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import http from "http";
import express from "express";
import { typeDefs, resolvers } from "./schema";
import { AWSS3Uploader, LocalUploader, Uploader } from "./service/upload";

const uploadService: Uploader =
  process.env.UPLOAD_TYPE === "AWS"
    ? new AWSS3Uploader({
        AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID!,
        AWS_SECRET_ACESSKEY: process.env.AWS_SECRET_ACESSKEY!,
        AWS_S3_DESTINATION_BUCKETNAME: process.env.AWS_S3_DESTINATION_BUCKETNAME!,
        REGION: process.env.REGION!,
      })
    : new LocalUploader();

export function getApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true,
    context: () => {
      return { uploadService };
    },
  });

  return { app, httpServer, server };
}
