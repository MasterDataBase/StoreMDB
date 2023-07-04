const { MongoClient } = require('mongodb');

var client;
var db;
var collection;

async function connectToMongoDB() {
  const uri = 'mongodb://127.0.0.1:27017/StoreMDB';
  
  try {
    // Create a new MongoClient
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Connect to the MongoDB server
    await client.connect();

    console.log('Connected to MongoDB');

    db = client.db('StoreMDB');
    collection = db.collection('StoreMDB');

    // Perform MongoDB operations here

    await findDocuments();

    // Close the connection
    await client.close();
    console.log('Connection closed');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

connectToMongoDB();


async function findDocuments() {
  try {
    const query = { "status": 'InStock' }; // Example query

    const documents = await collection.find(query).toArray();

    console.log('Found documents:');
    console.log(documents);
  } catch (err) {
    console.error('Failed to find documents:', err);
  } finally {
    return;
  }
}