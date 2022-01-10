const { Schema, model } = require("mongoose");
const Shelter = require("../models/Shelter.model");

const animalSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, trim: true },
  type: {
    type: String,
    enum: ["dog", "cat", "turtle", "fish", "exotic", "other"],
    required: true,
  },
  sex: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  size: {
    type: String,
    enum: ["small", "medium", "large"],
  },
  age: { type: Number },
  status: {
    type: String,
    enum: ["awaiting adoption", "adopted"],
  },
  color: { type: String },
  breed: { type: String },
  dateofentry: { type: Date, default: Date.now },
  kidfriendly: { type: Boolean },
  imageUrl: { type: Array },
  shelter: { type: Schema.Types.ObjectId, ref: "Shelter" },
});

module.exports = model("Animal", animalSchema);
