const dotenv = require('dotenv');

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  console.log('Loading in environment variables...');
  dotenv.config();
}

const { ApolloServer, gql } = require('apollo-server-azure-functions');
const { findOne } = require('../data-sources/cosmos/cosmosdb');
const { TrackCoronaAPI } = require('../data-sources/track-corona/track-corona');
const { distanceMeters } = require('../shared/helpers');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type CovidData {
    confirmed: Int
    recovered: Int
    dead: Int
    country_code: String
    location: String
    latitude: Float
    longitude: Float
    updated: String
  }

  type Query {
    covidDataLonLat(lon: Float!, lat: Float!): CovidData
    covidDataByCountry: [CovidData]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    covidDataLonLat: async(_source, { lon, lat }, { dataSources }) => {
      
      let raw = await dataSources.trackCoronaAPI.getProvinces();
      let convertedToDistanceFromClick = raw.data.map((longitude, latitude, location) => {
        distance = distanceMeters(lon, lat, longitude, latitude);
        console.log('distance', distance)
        return {
          distance,
          location
        }
      });
      console.log('me', convertedToDistanceFromClick);
      let sorted = convertedToDistanceFromClick.sort((a, b) => a.distance - b.distance);
      let closest = raw.data.find((data) => data.location === sorted[0].location);

      return closest;
    },
    covidDataByCountry: async(_source, _args, { dataSources }) => {
      return (await dataSources.trackCoronaAPI.getCountries()).data;
    }
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