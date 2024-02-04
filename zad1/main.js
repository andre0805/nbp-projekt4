const fs = require('fs');
const { MongoClient } = require("mongodb");

// 1. Parse the data from the file
const reviewsJson = fs.readFileSync('reviews.json', 'utf-8');
const reviews = JSON.parse(reviewsJson);

console.log('Inserting', reviews.length, 'records into MongoDB...');

// 2. Insert records into MongoDB
const url = 'mongodb://127.0.0.1:27018/?directConnection=true&serverSelectionTimeoutMS=2000';
const dbName = 'proj4';
const collectionName = 'reviews';

async function insertData() {
    const client = new MongoClient(url);
    
    try {
        // Get the database and collection on which to run the operation
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Remove all documents from the collection
        await collection.deleteMany({});

        // Use max write concern (5 as there are 5 nodes in the replica set)
        const options = { 
            writeConcern: { w: 0 },
        };

        const startTime = new Date();

        // Insert batches of 100 documents in the collection
        for (let i = 0; i < reviews.length; i += 100) {
            const records = reviews.slice(i, i + 100);
            await collection.insertMany(records, options);
        }

        const endTime = new Date();

        console.log('Duration:', endTime - startTime, 'ms');

        return endTime - startTime;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await client.close();
    }
}

async function run() {
    let durations = [];

    // Run 10 times
    for (let i = 0; i < 10; i++) {
        console.log(`Run #${i+1}`);
        const duration = await insertData();
        durations.push(duration);
    }

    // Calculate average duration
    const averageDuration = durations.reduce((acc, curr) => acc + curr, 0) / durations.length;

    // Calculate standard deviation
    const variance = durations.reduce((acc, curr) => acc + Math.pow(curr - averageDuration, 2), 0) / durations.length;
    const standardDeviation = Math.round(Math.sqrt(variance) * 100) / 100;

    console.log('Average duration:', averageDuration, 'ms');
    console.log('Standard deviation:', standardDeviation, 'ms');
}

run();