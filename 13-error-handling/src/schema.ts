import { gql } from "apollo-server";
import { ForbiddenError, InternelError, InvaildInputError } from "./errors";

type User = {
  id: string;
  username: string;
  age: number;
  money: number;
  is_active: boolean;
};

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    age: Int!
    money: Float!
    is_active: Boolean!
  }

  type Query {
    user(id: ID): User!
    internelError: String
  }
`;

const users: User[] = [
  { id: "1", username: "ho", age: 20, money: 20000, is_active: true },
  { id: "2", username: "jo", age: 21, money: 20000, is_active: true },
  { id: "3", username: "qo", age: 22, money: 20000, is_active: false },
  { id: "4", username: "wo", age: 23, money: 20000, is_active: true },
];

export const resolvers = {
  Query: {
    user: (parent, args: { id: string }) => {
      const { id } = args;
      if (!id) {
        throw new InvaildInputError(`Invaild user id:${id}`);
      }

      const user = users.find((_user) => _user.id === id);
      if (!user) {
        throw new ForbiddenError(`Forbidden user id:${id}`);
      }

      return user;
    },

    internelError: (parent, args) => {
      throw new InternelError("intented error");
    },
  },
};
