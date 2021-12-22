import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import http from "http";
import express from "express";
// import User from "./User";
// import Message from "./Message";
import { defaultFieldResolver, GraphQLSchema } from "graphql";
import { getDirective, mapSchema, MapperKind } from "@graphql-tools/utils";
// import AuthDirective from "./AuthDirective";

const PORT = 4000;

type valueOf<T> = T[keyof T];

const Roles = {
  UNKNOWN: 0,
  USER: 100,
  ADMIN: 1000,
};

type User = {
  name: string;
  role: valueOf<typeof Roles>;
};

async function getUserInfo(token?: string): Promise<User> {
  if (token === "user") {
    return {
      name: "user",
      role: Roles.USER,
    };
  }

  if (token === "admin") {
    return {
      name: "admin",
      role: Roles.ADMIN,
    };
  }

  return {
    name: "unknown",
    role: Roles.UNKNOWN,
  };
}

function getUserAuthInfo(role: number, requires: number) {
  return role >= requires;
}

function authDirective(directiveName: string) {
  const typeDirectiveArgumentMaps: Record<string, any> = {};
  return {
    authDirectiveTypeDefs: `directive @${directiveName}(
      requires: Role = USER,
    ) on OBJECT | FIELD_DEFINITION
    
    enum Role {
      ADMIN
      USER
      UNKNOWN
    }`,
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const authDirective = getDirective(schema, type, directiveName)?.[0];
          if (authDirective) {
            typeDirectiveArgumentMaps[type.name] = authDirective;
          }
          return undefined;
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirective =
            getDirective(schema, fieldConfig, directiveName)?.[0] ??
            typeDirectiveArgumentMaps[typeName];

          if (authDirective) {
            const { requires } = authDirective;
            const { resolve = defaultFieldResolver } = fieldConfig;

            fieldConfig.resolve = async (parent, args, context, info) => {
              if (!getUserAuthInfo(context.user.role, Roles[requires])) {
                throw new Error("not authorized");
              }

              return resolve(parent, args, context, info);
            };

            return fieldConfig;
          }
        },
      }),
  };
}

const { authDirectiveTypeDefs, authDirectiveTransformer } =
  authDirective("auth");

let schema = makeExecutableSchema({
  typeDefs: [
    authDirectiveTypeDefs,
    /* GraphQL */ `
      type User @auth(requires: USER) {
        name: String
        canPost: Boolean @auth(requires: ADMIN)
      }

      type Query {
        users: [User]
      }
    `,
  ],
  resolvers: {
    Query: {
      users() {
        return [
          {
            name: "Ben",
            canPost: false,
          },
        ];
      },
    },
  },
});

schema = authDirectiveTransformer(schema);

async function startApp() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req }) => {
      const user = await getUserInfo(req.headers.authorization);
      return { user };
    },
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
