import { gql } from "apollo-server";

type User = {
  id: string;
  username: string;
  age: number;
  money: number;
  is_active: boolean;
};

const users: User[] = [
  {
    id: "23hisudafhaskdfh",
    username: "JO",
    age: 23,
    money: 100.1,
    is_active: false,
  },
  {
    id: "543jkgsdjksdh",
    username: "KIM",
    age: 25,
    money: 110.1,
    is_active: true,
  },
];

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    age: Int!
    money: Float!
    is_active: Boolean!
  }

  type Query {
    user(id: ID!): User!
  }
`;

export const resolvers = {
  Query: {
    user: (parent, args): User => {
      const { id } = args;
      return users.find((user) => user.id === id)!;
    },
  },
};
