require("dotenv").config();
const mongoose = require("mongoose");
const Adopter = require("../models/Adopter.model");
const bcrypt = require("bcrypt");

const adopters = [
  {
    username: "adopter1",
    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(4)),
    email: "adopter1@test.com"
  },
  {
    username: "adopter2",
    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(4)),
    email: "adopter2@test.com"
  },
];

// connects to DB
require("./index");

Adopter.deleteMany()
  .then((users) =>
    console.log(`Deleted ${users.deletedCount} testing users (adopters)`)
  )
  .then(
    Adopter.insertMany(adopters).then((users) => {
      console.log(`Created ${users.length} testing users (adopters)`);
      mongoose.connection.close();
    })
  )
  .catch((err) =>
    console.log(
      `An error occurred seeding testing users (adopters) to the DB: ${err}`
    )
  );
  