const { Schema, model } = require("mongoose");

const userOptions = {
  discriminatorKey: "usertype", // our discriminator key, could be anything
  collection: "users",          // the name of our collection
};

// Our Base schema: these properties will be shared with our "children" schemas
const User = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }
  },
  userOptions
);

module.exports = model("User", User);
