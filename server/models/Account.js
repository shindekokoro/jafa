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
    default: 0
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

accountSchema.pre('save', async function(next) {
  const account = this;
  console.log('Calculating balance');
  account.calculatedBalance = account.transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  next();
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
