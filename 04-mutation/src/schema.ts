import { gql } from "apollo-server";

type User = {
  id: string;
  username: string;
  email: string;
  age: number;
  money: number;
  is_active: boolean;
};

const users: User[] = [
  {
    id: "23hisudafhaskdfh",
    username: "JO",
    email: "",
    age: 23,
    money: 100.1,
    is_active: false,
  },
  {
    id: "543jkgsdjksdh",
    username: "KIM",
    email: "",
    age: 25,
    money: 110.1,
    is_active: true,
  },
];

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    age: Int!
    money: Float!
    is_active: Boolean!
  }

  input UpdateUser {
    id: ID!
    email: String
    username: String
    money: Float
    is_active: Boolean
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    updateUser(updateUser: UpdateUser): User # multi
    updateUserEmail(id: ID!, email: String!): User # single
  }
`;

export const resolvers = {
  Query: {
    users: (parent, args): User[] => {
      return users;
    },
  },
  Mutation: {
    updateUserEmail: (parent, args): User => {
      const { id, email } = args;
      const user = users.find((user) => user.id === id)!;

      user.email = email;
      return user;
    },

    updateUser: (parent, args): User => {
      const { updateUser } = args;
      const user = users.find((user) => user.id === updateUser.id)!;
      for (const key in updateUser) {
        user[key] = updateUser[key];
      }
      return user;
    },
  },
};
