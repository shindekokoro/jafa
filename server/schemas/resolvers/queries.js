const { User, Account, Transaction } = require('../../models');
const { AuthenticationError } = require('../../utils/auth');

const Query = {
  user: async (parent, args, context) => {
    if (context.user) {
      return User.findOne({ _id: context.user._id }).populate({
        path: 'accounts',
        populate: { path: 'institution' }
      });
    }
    throw new AuthenticationError('You are not authenticated.');
  },
  accounts: async (parent, { username }) => {
    const params = username ? { username } : {};
    let accounts = await Account.find(params).populate('user');
    console.log(accounts);
    return accounts;
  },
  account: async (parent, { accountId }) => {
    let account = await Account.findOne({ _id: accountId })
      .populate('institution')
      .populate({ path: 'transactions', populate: { path: 'payee' } })
      .populate({
        path: 'transactions',
        populate: { path: 'category', populate: { path: 'categoryType' } }
      });
    return account;
  },
  transactions: async (parent, { accountId }) => {
    let transactions = await Transaction.find({ account: accountId })
      .populate({ path: 'payee' })
      .populate({ path: 'category', populate: { path: 'categoryType' } })
      .sort({ purchaseDate: -1 });
    return transactions;
  }
};

module.exports = Query;
