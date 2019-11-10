import mongoose from 'mongoose';

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
    token_created_date: {
        type: Date,
        required: true,
        default: Date.now.toISOString()
    }
}, { _id: false });

module.exports = { authSchema };