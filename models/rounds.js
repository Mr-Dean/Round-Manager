const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoundSchema = new Schema({
    roundNumbe: Number,
    jobs: []

});

module.exports = mongoose.model('Round', RoundSchema);