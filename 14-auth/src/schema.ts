import { gql } from "apollo-server";

export const typeDefs = gql`
  # directive @auth(requires: Role!) on FIELD_DEFINITION

  # enum Role {
  #   ADMIN
  #   USER
  #   MESSAGE_PARTICIPANT
  # }

  # type Message {
  #   id: ID
  #   receiverId: ID
  #   senderId: ID
  #   text: String
  # }

  # type User {
  #   id: ID!
  #   username: String!
  #   email: String!
  #   roles: [Role] @auth(requires: ADMIN)
  #   message(id: ID!): Message @auth(requires: MESSAGE_PARTICIPANT)
  # }

  # type Query {
  #   currentUser: User @auth(requires: USER)
  # }

  type Query {
    hello: String @upper
  }
`;

export const resolvers = {
  // User: {
  //   message: (user, args, context) => context.Message.getById(args.id),
  // },
  // Query: {
  //   currentUser: (parent, args, context) => context.user,
  // },

  Query: {
    hello: () => "hello",
  },
};
