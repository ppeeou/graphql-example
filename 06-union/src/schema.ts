import { gql } from "apollo-server";

type Book = {
  title: string;
};

const books: Book[] = [
  { title: "book name1" },
  { title: "book name2" },
  { title: "book name3" },
  { title: "book name4" },
];

type Author = {
  name: string;
};

const authors: Author[] = [
  { name: "author name1" },
  { name: "author name2" },
  { name: "author name3" },
  { name: "author name4" },
];

export const typeDefs = gql`
  union SearchResult = Book | Author

  type Book {
    title: String!
  }

  type Author {
    name: String!
  }

  type Query {
    search(contains: String): [SearchResult!]
  }
`;

export const resolvers = {
  SearchResult: {
    __resolveType(result, context, info) { 
      if (result.name) {
        return "Author";
      }
      // Only Book has a title field
      if (result.title) {
        return "Book";
      }
      return null; // GraphQLError is thrown
    },
  },
  Query: {
    search: (parent, args) => { 
      return [...books, ...authors];
    },
  },
};
