const { Account } = require('../../../models');

const account = async (_, { account }) => {
  let searchedAccount = await Account.findOne({ _id: account })
    .populate('institution')
    .populate({ path: 'transactions', populate: { path: 'payee' } })
    .populate({ path: 'transactions', populate: { path: 'category' } })
    .populate({ path: 'transactions', populate: { path: 'categoryType' } });
  return searchedAccount;
};

const accounts = async (_, { username }) => {
  console.log('username', username);
  let searchedAccounts = await Account.find({ username } || {}).populate('user');
  return searchedAccounts;
};
module.exports = { accounts, account };
