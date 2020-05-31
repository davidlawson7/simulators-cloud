const dotenv = require('dotenv');

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  console.log('Loading in environment variables...');
  dotenv.config();
}

const { ApolloServer, gql } = require('apollo-server-azure-functions');
const { findOne } = require('../data-sources/cosmos/cosmosdb');
const { TrackCoronaAPI } = require('../data-sources/track-corona/track-corona');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type CovidDataByCity {
    confirmedCases: Int!
    recoveredCases: Int!
    activeCases: Int!
    deaths: Int!
    city: String
    state: String
    country: String!
    latitude: Int!
    longitude: Int!
  }

  type TestDocument {
    id: String
    name: String
  }

  type Query {
    mongoTestDoc: TestDocument
    covidDataByCity: CovidDataByCity
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    // mongoTestDoc: async () => {
    //   result = await findOne('test_db', 'test_collection', { id: '1' });
    //   return result;
    // },
    covidDataByCity: async(_source, _args, { dataSources }) => {
      let data = await dataSources.trackCoronaAPI.getCountryLevelData('au');

      if (!(data.length > 1)) {
        return null;
      }

      return {

      }
      
      console.log('Response', data);
      return {
        confirmedCases: 102,
        recoveredCases: 100,
        activeCases: 2,
        deaths: 0,
        country: 'Australia',
        latitude: 0,
        longitude: 1
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      trackCoronaAPI: new TrackCoronaAPI(),
    };
  },
});

exports.graphqlHandler = server.createHandler();