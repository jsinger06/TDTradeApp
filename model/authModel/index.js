const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

const Schema = mongoose.Schema;

const authSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        default: 1
    },
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
    },
    updatedAt: {
        type: Date,
        required: true
    }
}, { _id: false, timestamps: true });

module.exports = { authSchema };