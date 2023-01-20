const mongoose = require('mongoose');

//Single Link Model Schema for MongoDB (Mongoose)
const linkSchema = new mongoose.Schema({
    _id: Number,
    link: String,
    isCustom: Boolean,
    hash: String,
    clicks: Number,
});

//Compiling Single Link Schema into Link Model
const Link = new mongoose.model("Link", linkSchema);

module.exports = Link;