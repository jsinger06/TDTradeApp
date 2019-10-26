import mongoose from 'mongoose';

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

const Schema = mongoose.Schema;

export const authSchema = new Schema({
    token: {
        type: String,
        required: 'key'
    },
    access_token: {
        type: String,
        required: 'access_token'
    },
    refresh_token: {
        type: String,
    },
    token_created_date: {
        type: Date,
        default: Date.now
    }
});
