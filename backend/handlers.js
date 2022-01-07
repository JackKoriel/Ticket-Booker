"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// use this data. Changes will persist until the server (backend) restarts.
const { flights, reservations } = require("./data");

//importing standard stuff
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getFlights = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("slingshot");

    const results = await db.collection("all-flights").find().toArray();
    // console.log(results);
    const numberFlights = results.map((el) => {
      return Object.values(el)[0];
    });
    // console.log(numberFlights);
    numberFlights
      ? res.status(200).json({ status: 200, data: numberFlights })
      : res.status(404).json({ status: 404, data: "Flights not found" });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong, please try again later.",
    });
  } finally {
    client.close();
    // console.log("disconnected!");
  }
};

const getFlight = async (req, res) => {
  const _id = req.params._id;
  const client = new MongoClient(MONGO_URI, options);
  // console.log("ID", req.params._id);
  try {
    await client.connect();
    const db = client.db("slingshot");
    // console.log("ID", _id);
    const results = await db.collection("all-flights").findOne({ _id });
    // console.log(results);
    results
      ? res.status(200).json({ status: 200, data: results.seats })
      : res.status(404).json({ status: 404, data: "Flights not found" });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong, please try again later.",
    });
  } finally {
    client.close();
    // console.log("disconnected!");
  }
};

const addReservations = async (req, res) => {
  // console.log(req.body);

  const { flight, seat, givenName, surname, email } = req.body;

  const client = new MongoClient(MONGO_URI, options);

  ///check a way to get isAvailable in backend after the user clicks on the chair
  // if (!isAvailable) {
  //   return res
  //     .status(400)
  //     .json({ status: 400, message: "Seat already booked" });
  // }
  if (!givenName || !surname || !email) {
    return res.status(400).json({
      status: 400,
      message: "Some info is missing, please fill all fields.",
    });
  } else if (!seat) {
    return res.status(400).json({
      status: 400,
      message: "Please select a seat :)",
    });
  } else if (!email.includes("@")) {
    return res.status(400).json({
      status: 400,
      message: "Please provide a valid email address.",
    });
  }
  try {
    const _id = uuidv4();
    await client.connect();
    const db = client.db("slingshot");
    // console.log("ID", _id);
    console.log("UUID", req.body);
    await db.collection("reservations").insertMany([{ ...req.body, _id }]);

    const query = { _id: flight, "seats.id": seat };
    // console.log(query);
    const newValues = {
      $set: { "seats.$.isAvailable": false },
    };
    // console.log(newValues);
    await db.collection("all-flights").updateOne(query, newValues);

    res.status(201).json({
      status: 201,
      message: "Reservation created.",
      data: { ...req.body, _id },
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong, please try again later.",
    });
  } finally {
    client.close();
    // console.log("disconnected!");
  }
};

const getReservations = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("slingshot");
    const results = await db.collection("reservations").find().toArray();
    // console.log(results);
    results
      ? res.status(200).json({ status: 200, data: results })
      : res.status(404).json({ status: 404, data: "Flights not found" });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong, please try again later.",
    });
  } finally {
    client.close();
    // console.log("disconnected!");
  }
};

const getSingleReservation = async (req, res) => {
  const { _id } = req.params;
  console.log(req.params);
  const client = new MongoClient(MONGO_URI, options);
  // console.log("ID", req.params._id);
  try {
    await client.connect();
    const db = client.db("slingshot");
    // console.log("ID", _id);
    const results = await db.collection("reservations").findOne({ _id });
    console.log(results);
    results
      ? res.status(200).json({ status: 200, data: results })
      : res.status(404).json({ status: 404, data: "Reservation not found" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.stack });
  } finally {
    client.close();
    // console.log("disconnected!");
  }
};

const deleteReservation = async (req, res) => {
  const { reservationId } = req.params;

  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("slingshot");
    // console.log("ID", _id);
    const reservation = await db
      .collection("reservations")
      .findOne({ _id: reservationId });

    const query = { _id: reservation.flight, "seats.id": reservation.seat };
    // console.log(query);
    const newValues = {
      $set: { "seats.$.isAvailable": true },
    };
    // console.log(newValues);
    await db.collection("all-flights").updateOne(query, newValues);
    await db.collection("reservations").deleteOne({ _id: reservationId });
    res.status(200).json({
      status: 200,
      data: reservationId,
      message: "Reservation deleted.",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong, please try again later.",
    });
  } finally {
    client.close();
    // console.log("disconnected!");
  }
};

const updateReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { reservationId } = req.params;

  const {
    givenName,
    surname,
    email,
    seat: seatId,
    flight: flightId,
  } = req.body;
  let value;

  // session.startTransaction( { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } } );

  if (!givenName) {
    value = {
      $set: { email, surname, seatId },
    };
  } else if (!surname) {
    value = {
      $set: { givenName, email, seatId },
    };
  } else if (!email) {
    value = {
      $set: { givenName, surname, seatId },
    };
  } else if (!seatId) {
    value = {
      $set: { givenName, surname, email },
    };
  } else {
    value = {
      $set: { givenName, surname, email, seatId },
    };
  }

  try {
    await client.connect();
    const db = client.db("slingshot");

    const selectedFlight = await db
      .collection("all-flights")
      .findOne({ _id: flightId });
    const reservation = await db
      .collection("reservations")
      .findOne({ _id: reservationId });

    let filteredSeat = selectedFlight.seats.find((seatObj) => {
      return seatObj.id === seatId;
    });
    console.log(filteredSeat);

    if (!filteredSeat.isAvailable) {
      return res.status(400).json({
        status: 400,
        message: "Seat is unavailable.",
      });
    }

    const newValuesNewSeat = {
      $set: { "seats.$.isAvailable": false },
    };

    const newValuesOldSeat = {
      $set: { "seats.$.isAvailable": true },
    };

    //updating reservation values
    await db
      .collection("reservations")
      .updateOne({ _id: reservationId }, value);

    //updating previous seat availability
    await db
      .collection("all-flights")
      .updateOne(
        { _id: reservation.flight, "seats.id": seatId },
        newValuesNewSeat
      );

    //updating new seat availability
    await db
      .collection("all-flights")
      .updateOne(
        { _id: reservation.flight, "seats.id": reservation.seat },
        newValuesOldSeat
      );

    res.status(200).json({ status: 200, message: "Sucess" });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong, please try again later.",
    });
  } finally {
    client.close();
    // console.log("disconnected!");
  }
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservations,
  getSingleReservation,
  deleteReservation,
  updateReservation,
};
