import { gql } from "apollo-server";

export const authorTypeDefs = gql`
  extend type Query{
    author(id: ID!):Author
  }

  type Author {
    id: ID!
    firstName: String
    lastName: String
    books: [Book]
  }
`;

export const authorResolvers = {
  Query: {
    author: () => {
      return {
        id: 'asdfasdf',
        firstName: 'hyunwoo',
        lastName: 'Jo'
      };
    }
  },

  Author: {
    books: (parent) => {
      return [{
        title: parent.firstName,
      }];
    }
  }
};