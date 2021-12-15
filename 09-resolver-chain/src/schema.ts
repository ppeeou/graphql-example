import { gql } from "apollo-server";

type Library = {
  branch: string;
};

const libraries = [
  {
    branch: "downtown",
  },
  {
    branch: "riverside",
  },
];

// The branch field of a book indicates which library has it in stock
const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
    branch: "riverside",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
    branch: "downtown",
  },
];

export const typeDefs = gql`
  type Library {
    branch: String!
    books: [Book!]
  }

  type Book {
    title: String!
    author: Author!
  }

  type Author {
    name: String!
  }

  type Query {
    libraries: [Library]
  }
`;

export const resolvers = {
  Query: {
    libraries: (parent, args) => {
      return libraries;
    },
  },

  Library: {
    books(parent) {
      return books.filter((book) => book.branch === parent.branch);
    },
  },

  Book: {
    author(parent) {
      return { name: parent.author };
    },
  },
};
