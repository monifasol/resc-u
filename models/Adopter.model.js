const { Schema, model } = require("mongoose");
const User = require("./User.model"); 

const Adopter = User.discriminator("Adopter",
  new Schema(
    {
      fullname: String,
      location: String,
      children: Boolean,
      imageUrl: String,
      animalPreference: [String],
      housingSize: {
        type: String,
        enum: ["small apartment", "big apartment", "house"]
      },
      favorites: [{ type: Schema.Types.ObjectId, ref: "Animal" }]
    })
);

module.exports = model('Adopter');
