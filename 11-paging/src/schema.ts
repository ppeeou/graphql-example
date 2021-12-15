import { gql } from "apollo-server";
import { TimestampResolver } from "graphql-scalars";
import todos from "./data/todos.json";

type DIRECTION = 'ASC' | 'DESC';
type TodoOrderField = 'CREATE_AT' | 'PRIORITY';
type TodoStatus = 'DONE' | 'PROCESS';
type TodoOrder = { direction: DIRECTION, field: TodoOrderField; };

type Todo = {
  id: string;
  text: string;
  priority: number;
  status: TodoStatus;
  create_at: string;
};

export const typeDefs = gql`
  scalar Cursor

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: Cursor
    endCursor: Cursor
  }

  type TodoConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [TodoEdge]
  }

  type TodoEdge {
    node: Todo
    cursor: Cursor!
  }

  type Todo {
    id: ID!
    text: String!
    priority: Int!
    status: TodoStatus
    create_at: String!
  }

  enum TodoStatus {
    DONE
    PROCESS
  }

  enum TodoOrderField {
    CREATE_AT
    PRIORITY
  }

  enum OrderDirection {
    ASC
    DESC
  }

  input TodoOrder {
    direction: OrderDirection
    field: TodoOrderField
  }

  type Query {
    todos(
      # Forward pagination
      first: Int
      after: Cursor
      # Backward pagination
      last: Int
      before: Cursor
      # order
      orderBy: TodoOrder
    ): TodoConnection
  }
`;

const sort = (a: Todo, b: Todo, orderBy: TodoOrder) => {
  // Database orderby
  // now we just use 'created_At'
  if (a.create_at > b.create_at) {
    return 1;
  }
  if (a.create_at < b.create_at) {
    return -1;
  }
  return 0;
};


const forwardPaging = (first: number, after: string, orderBy: TodoOrder) => {
  const totalCount = todos.length;
  const sortedTodos = todos.sort((a, b) => sort(a as Todo, b as Todo, orderBy));
  const startIndex = after ? sortedTodos.findIndex(todo => new Date(todo.create_at).getTime() >= new Date(after).getTime()) + 1 : 0;
  const resultTodos = todos.slice(startIndex, startIndex + first);
  const edges = resultTodos.map((todo) => ({ node: todo, cursor: todo.create_at }));

  return {
    totalCount,
    pageInfo: {
      endCursor: edges[edges.length - 1].cursor,
      hasNextPage: startIndex + first < totalCount
    },
    edges,
  };
};

const backwardPaging = (last: number, before: string, orderBy: TodoOrder) => {
  const totalCount = todos.length;
  const sortedTodos = todos.sort((a, b) => sort(a as Todo, b as Todo, orderBy));
  const startIndex = before ? sortedTodos.findIndex(todo => new Date(todo.create_at).getTime() >= new Date(before).getTime()) : 0;
  const resultTodos = todos.slice(startIndex - last, startIndex);
  const edges = resultTodos.map((todo) => ({ node: todo, cursor: todo.create_at }));

  return {
    totalCount,
    pageInfo: {
      startCursor: edges[0].cursor,
      hasPreviousPage: startIndex > 0
    },
    edges,
  };
};

const paging = ({ first, after, last, before, orderBy }) => {
  if (typeof first === 'number' && first > 0) {
    return forwardPaging(first, after, orderBy);
  } else if (typeof last === 'number' && last > 0) {
    return backwardPaging(last, before, orderBy);
  }

  throw new RangeError('range error');
};

export const resolvers = {
  Cursor: TimestampResolver,
  Query: {
    todos: (parent, args) => {
      return paging(args);
    },
  },
};
