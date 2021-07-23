const mongoose = require('mongoose');
const { Schema } = mongoose;

const OperativeSchema = new Schema({
    name: String,
    number: Number,
    jobs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ]
})

module.exports = mongoose.model('Operative', OperativeSchema);