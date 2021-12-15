import { gql } from "apollo-server";
import { GraphQLScalarType, Kind } from "graphql";

export const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    username: String!
    age: Int!
    money: Float!
    is_active: Boolean!
    date: Date!
  }

  type Query {
    getUser(id: ID!, date: Date): User!
  }
`;

const dateScalar = new GraphQLScalarType<Date, number>({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    return (value as Date).getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value as number); // Convert incoming integer to Date (input data)
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return new Date(); // Invalid hard-coded value (not an integer)
  },
});

export const resolvers = {
  Date: dateScalar,
  Query: {
    getUser: (parent, args) => {
      return {
        id: args.id,
        username: "hyunwoo",
        age: 23,
        money: 100.1,
        is_active: false,
        date: args.date,
      };
    },
  },
};
