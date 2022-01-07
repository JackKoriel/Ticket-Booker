// var fs = require("file-system");

// const flightData = JSON.parse(fs.readFileSync("data/greetings.json"));

const { MongoClient } = require("mongodb");
const { flights, reservations } = require("./data");

// let test = flights.map((element) => {
//   return Object.keys(element)[0];
// });
// console.log(test);

require("dotenv").config();
// console.log("env: ", process.env.MONGO_URI);
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const batchImport = async () => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    // console.log(greetings);
    await client.connect();
    const db = client.db(`slingshot`);
    const flightsNumbers = Object.keys(flights);

    const results = flightsNumbers.map((flight) => {
      return { _id: flight, seats: flights[flight] };
    });

    await db.collection("all-flights").insertMany(results);

    await db.collection("reservations").insertMany(reservations);
  } catch (err) {
    // console.log(err.stack);
    // res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
    // console.log("disconnected!");
  }
};

batchImport();
