const mongoose = require('mongoose');

//Schema for next link id model
const nextSchema = new mongoose.Schema({
    _id: Number,
    next: Number,
});

//Compiling Single Next Schema into Next Model
const Next = new mongoose.model("Next", nextSchema);

//Setting the first number to be 1 (to be run for first time only)
const firstNum = new Next({
    _id: 1,
    next: 1,
});

// Saving the firstNum to database
//firstNum.save();

module.exports = Next;