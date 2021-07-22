const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
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