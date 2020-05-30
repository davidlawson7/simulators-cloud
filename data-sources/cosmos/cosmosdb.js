const mongoClient = require("mongodb").MongoClient;

// Import these from some environment file
const COSMOS_USERNAME = process.env.COSMOS_USERNAME;
const COSMOS_PASSWORD = process.env.COSMOS_PASSWORD;
const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT;
const COSMOS_PORT = process.env.COSMOS_PORT;
const COSMOS_APP_NAME = process.env.COSMOS_APP_NAME;

const url = `mongodb://${COSMOS_USERNAME}:${COSMOS_PASSWORD}@${COSMOS_ENDPOINT}.mongo.cosmos.azure.com:${COSMOS_PORT}/?ssl=true&appName=@${COSMOS_APP_NAME}@`;

/**
 * Given a query, will find one entry in a specified db and collection.
 * Trial.
 */
exports.findOne = async function(dbName, collectionName, query) {
  let result;

  const client = await mongoClient.connect(url)
    .catch(err => console.log(err));
  
  if (!client) {
    return;
  }

  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    result = await collection.findOne(query);
    console.log('a result', result);

  } catch (err) {
    console.log(err);
  } finally {
    console.log('closing connection');
    client.close();
  }

  return result;
}
