const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoundSchema = new Schema({
    roundNumber: Number,
    jobs: []

});

module.exports = mongoose.model('Round', RoundSchema);