import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import express from "express";
import { typeDefs, resolvers } from "./schema";
import { InternelError } from "./errors";

const PORT = 4000;

const formatError = (err) => {
  if (err.originalError instanceof InternelError) {
    console.error("--- GraphQL Error ---");
    console.error("Path:", err.path);
    console.error("Message:", err.message);
    console.error("Code:", err.extensions.code);
    console.error("Original Error", err.originalError);
  }
  return err;
};

async function startApp() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    debug: process.env.NODE_ENV !== "production",
    formatError,
  });

  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: "*",
    },
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.info(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startApp();
