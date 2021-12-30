import { graphqlUploadExpress } from "graphql-upload";
import { getApolloServer } from "./server";

const { app, server, httpServer } = getApolloServer();

const PORT = 4000;

async function startApp() {
  await server.start();

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());

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
