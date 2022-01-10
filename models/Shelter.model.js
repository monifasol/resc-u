const { Schema, model } = require("mongoose");

const User = require("./User.model"); 

const Shelter = User.discriminator("Shelter",
  new Schema({
        name:  String,
        address:  String,
        contact_email: String, 
        contact_phone: String 
    })
);

module.exports = model('Shelter');
