import { gql } from "apollo-server";

type ValueOf<T> = T[keyof T];

const Code = {
  Success: 1000,
  Fail: 1001,
} as const;

type Response = {
  code: ValueOf<typeof Code>;
  message: string;
};

const responseSuccess = (): Response => {
  return {
    code: Code.Success,
    message: "",
  };
};

const responseFail = (msg: string): Response => {
  return {
    code: Code.Fail,
    message: msg,
  };
};

type User = {
  id: string;
  username: string;
  email: string;
  age: number;
};

const users: User[] = [
  {
    id: "23hisudafhaskdfh",
    username: "JO",
    email: "",
    age: 23,
  },
  {
    id: "543jkgsdjksdh",
    username: "KIM",
    email: "",
    age: 25,
  },
];

export const typeDefs = gql`
  interface MutationResponse {
    code: String!
    message: String!
  }

  type MutationUserResponse {
    code: String!
    message: String!
    user: User
  }

  type User {
    id: ID!
    username: String!
    email: String!
    age: Int!
  }

  input UpdateUser {
    id: ID!
    email: String
    username: String
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    updateUser(updateUser: UpdateUser): MutationUserResponse # multi
  }
`;

export const resolvers = {
  Query: {
    users: (parent, args): User[] => {
      return users;
    },
  },
  Mutation: {
    updateUser: (parent, args): Response & { user?: User } => {
      const { updateUser } = args;
      const user = users.find((user) => user.id === updateUser.id);

      if (!user) {
        return responseFail("Not found user");
      }

      for (const key in updateUser) {
        user[key] = updateUser[key];
      }
      return { ...responseSuccess(), user };
    },
  },
};
