const { Account } = require('../../../models');

const account = async (_, { account }, context) => {
  let searchedAccount = await Account.findOne({ _id: account, user: context.user._id })
    .populate('institution')
    .populate({ path: 'transactions', populate: { path: 'payee' } })
    .populate({ path: 'transactions', populate: { path: 'category' } })
    .populate({ path: 'transactions', populate: { path: 'categoryType' } });
  return searchedAccount;
};

const accounts = async (_, __, context) => {
  let searchedAccounts = await Account.find({ user: context.user._id })
    .populate('user')
    .populate('institution')
    .populate({ path: 'transactions', populate: { path: 'payee' } })
    .populate({ path: 'transactions', populate: { path: 'category' } })
    .populate({ path: 'transactions', populate: { path: 'categoryType' } });
  return searchedAccounts;
};
module.exports = { accounts, account };
