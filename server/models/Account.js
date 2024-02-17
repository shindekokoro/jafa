const mongoose = require('mongoose');

const { Schema } = mongoose;

const accountSchema = new Schema({
  accountName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  institution: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Institution'
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  currency: {
    type: String,
    required: true,
    trim: true
  },
  startingBalance: { 
    type: Number,
    required: true
  },
  calculatedBalance: {
    type: Number,
    get: (transactions) => transactions.reduce((acc, transaction) => acc + transaction.amount, 0) 
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
