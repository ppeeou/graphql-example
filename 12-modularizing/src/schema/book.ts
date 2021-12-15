import { gql } from "apollo-server";

export const bookTypeDefs = gql`
  extend type Query{
    book(id: ID!): Book
  }

  type Book {
    title: String!
    author: Author
  }
`;

export const bookResolvers = {
  Query: {
    book: () => {
      return {
        title: 'hello',
      };
    }
  },
  Book: {
    author: (parent) => {
      return {
        firstName: parent.title
      };
    }
  }
};