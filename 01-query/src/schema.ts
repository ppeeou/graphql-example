import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    age: Int!
    money: Float!
    is_active: Boolean!
  }

  type Query {
    user: User!
  }
`;

export const resolvers = {
  Query: {
    user: (parent, args) => {
      return {
        id: "23hisudafhaskdfh",
        username: "hyunwoo",
        age: 23,
        money: 100.1,
        is_active: false,
      };
    },
  },
};
