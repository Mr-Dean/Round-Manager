const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    operative: {
        type: Schema.Types.ObjectId,
        ref: 'Operative'
    }
})

module.exports = mongoose.model('Job', JobSchema);