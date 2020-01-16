import mongoose from 'mongoose';
const config = require('../../config');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

const Schema = mongoose.Schema;

const acctSchema = new Schema({
    _id: {
        type: String,
        required: true,
        default: config.tradeAcct.userName
    },
    roundTrips: {
        type: Number,
        required: true
    },
    isInCall: {
        type: Boolean
    },
    marginBalance: {
        type: Number,
        required: true
    },
    accountValue: {
        type: Number,
        required: true
    },
    longMarginValue: {
        type: Number,
        required: true
    },
    availableFundsNonMarginableTrade: {
        type: Number,
        required: true
    },
    buyingPower: {
        type: Number,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    }
}, { _id: false, timestamps: true});

module.exports = { acctSchema };