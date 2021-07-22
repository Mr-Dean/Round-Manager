const mongoose = require('mongoose');
const { Schema } = mongoose;

const OperativeSchema = new Schema({
    name: String,
    number: Number
})

module.exports = mongoose.model('Operative', OperativeSchema);