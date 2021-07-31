const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobSchema = new Schema({
    roundNumber: Number,
    ref: String,
    name: String,
    address: String,
    freq: String,
    accManager: String,
    details: String,
    exterior: Number,
    interior: Number,
    riskAssess: String,
})

module.exports = mongoose.model('Job', JobSchema);