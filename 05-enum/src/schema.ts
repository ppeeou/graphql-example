import { gql } from "apollo-server";

type ValueOf<T> = T[keyof T];

const Color = {
  RED: "#f00",
  GREEN: "#0f0",
  BLUE: "#00f",
} as const;

type User = {
  id: string;
  username: string;
  email: string;
  age: number;
  money: number;
  is_active: boolean;
  favoriteColor: ValueOf<typeof Color>;
};

const users: User[] = [
  {
    id: "23hisudafhaskdfh",
    username: "JO",
    email: "",
    age: 23,
    money: 100.1,
    is_active: false,
    favoriteColor: Color.BLUE,
  },
  {
    id: "543jkgsdjksdh",
    username: "KIM",
    email: "",
    age: 25,
    money: 110.1,
    is_active: true,
    favoriteColor: Color.RED,
  },
];

export const typeDefs = gql`
  enum AllowedColor {
    RED
    GREEN
    BLUE
  }

  type User {
    id: ID!
    username: String!
    email: String!
    age: Int!
    money: Float!
    is_active: Boolean!
    favoriteColor: AllowedColor!
  }

  type Query {
    user(id: ID!): User!
    users: [User!]!
  }

  type Mutation {
    updateUserFavoriteColor(id: ID!, color: AllowedColor!): User!
  }
`;

export const resolvers = {
  AllowedColor: {
    RED: Color.RED,
    GREEN: Color.GREEN,
    BLUE: Color.BLUE,
  },

  Query: {
    users: (parent, args): User[] => {
      return users;
    },
    user: (parent, args): User => {
      const { id } = args;
      return users.find((user) => user.id === id)!;
    },
  },

  Mutation: {
    updateUserFavoriteColor: (parent, args): User => {
      const { id, color } = args;
      const user = users.find((user) => user.id === id)!;
      user.favoriteColor = color;
      return user;
    },
  },
};
