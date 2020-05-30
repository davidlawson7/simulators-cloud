const dotenv = require('dotenv');

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  console.log('Loading in environment variables...');
  dotenv.config();
}

const { ApolloServer, gql } = require('apollo-server-azure-functions');
const { findOne } = require('../data-sources/cosmos/cosmosdb');


// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type TestDocument {
    id: String
    name: String
  }

  type Query {
    mongoTestDoc: TestDocument
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    mongoTestDoc: async () => {
      result = await findOne('test_db', 'test_collection', { id: '1' });
      return result;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();