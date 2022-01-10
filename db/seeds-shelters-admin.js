require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Shelter = require("../models/Shelter.model");
const bcrypt = require("bcrypt");

const shelters = [
  {
    username: "shelter-barcelona",
    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(4)),
    email: "shelter-barcelona@test.com"
  },
  {
    username: "shelter-madrid",
    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(4)),
    email: "shelter-madrid@test.com"
  }
];

const admins = [
  {
    username: "test-admin",
    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(4)),
    email: "admin@test.com"
  },
];

// connects to DB
require("./index");

Shelter.deleteMany()
  .then((users) =>
    console.log(`Deleted ${users.deletedCount} testing users (shelters)`)
  )
  .then(
    Shelter.insertMany(shelters).then((users) => {
      console.log(`Created ${users.length} testing users (shelters)`);
      mongoose.connection.close();
    })
  )
  .catch((err) =>
    console.log(
      `An error occurred seeding testing users (shelters) to the DB: ${err}`
    )
  );

User.deleteMany()
  .then((users) =>
    console.log(`Deleted ${users.deletedCount} testing users (admins)`)
  )
  .then(
    User.insertMany(admins).then((users) => {
      console.log(`Created ${users.length} testing users (admins)`);
      mongoose.connection.close();
    })
  )
  .catch((err) =>
    console.log(
      `An error occurred seeding testing users (admins) to the DB: ${err}`
    )
  );
