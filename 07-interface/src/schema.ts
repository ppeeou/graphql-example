import { gql } from "apollo-server";

type Author = {
  name: string;
};

type Book = {
  title: string;
  author: Author;
};

type Course = {
  name: string;
};

type TextBook = {
  course: Course[];
} & Book;

type ColorBook = {
  colors: string[];
} & Book;

const textBooks: TextBook[] = [
  {
    title: "book name1",
    author: { name: "author name1" },
    course: [{ name: "course1" }],
  },
  {
    title: "book name2",
    author: { name: "author name2" },
    course: [{ name: "course2" }],
  },
];

const colorBooks: ColorBook[] = [
  {
    title: "book name1",
    author: { name: "author name1" },
    colors: ["red"],
  },
  {
    title: "book name2",
    author: { name: "author name2" },
    colors: ["blue"],
  },
];

export const typeDefs = gql`
  interface Book {
    title: String!
    author: Author!
  }

  type TextBook implements Book {
    title: String!
    author: Author!
    course: [Course!]!
  }

  type ColoringBook implements Book {
    title: String!
    author: Author!
    colors: [String!]!
  }

  type Author {
    name: String!
  }

  type Course {
    name: String!
  }

  type Query {
    books: [Book!]!
  }
`;

export const resolvers = {
  Book: {
    __resolveType(book, context, info) {
      // Only Textbook has a courses field
      if (book.course) {
        return "TextBook";
      }
      // Only ColoringBook has a colors field
      if (book.colors) {
        return "ColoringBook";
      }
      return null; // GraphQLError is thrown
    },
  },
  Query: {
    books: (parent, args) => {
      return [...textBooks, ...colorBooks];
    },
  },
};
