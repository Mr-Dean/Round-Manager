const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoundSchema = new Schema({
    round: Number,
    operative: String,
    jobs: []

});

module.exports = mongoose.model('Round', RoundSchema);