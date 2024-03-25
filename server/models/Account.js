const mongoose = require('mongoose');
const Transaction = require('./Transaction');

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

accountSchema.pre('findOneAndUpdate', async function(next) {
  let account = await Account.findOne(this.getQuery());
  let transactions = await Transaction.find({ account: account._id });

  account.calculatedBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, account.startingBalance);
  this.setUpdate({ calculatedBalance: account.calculatedBalance });
  next();
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
