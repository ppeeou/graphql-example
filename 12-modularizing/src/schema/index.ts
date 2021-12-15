import { gql } from "apollo-server";
import { makeExecutableSchema, } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';

import { authorTypeDefs, authorResolvers } from './author';
import { bookTypeDefs, bookResolvers } from './book';

const typeDefs = gql`
  type Query {
    _empty:String
  }
`;
const resolvers = {};


export default makeExecutableSchema({
  typeDefs: ([typeDefs, authorTypeDefs, bookTypeDefs]),
  resolvers: mergeResolvers([resolvers, authorResolvers, bookResolvers])
});