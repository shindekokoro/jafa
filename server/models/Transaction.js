const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  payee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Payee'
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'CategoryName'
  },
  amount: {
    type: Number,
    required: true
  },
  split: {
    type: Boolean,
    default: false
  },
  related: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  cleared: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
