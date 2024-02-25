const { Account } = require('../../../models');

const accounts = async (parent, { username }) => {
  const params = username ? { username } : {};
  let accounts = await Account.find(params).populate('user');
  return accounts;
};

const account = async (parent, { accountId }) => {
  let account = await Account.findOne({ _id: accountId })
    .populate('institution')
    .populate({ path: 'transactions', populate: { path: 'payee' } })
    .populate({
      path: 'transactions',
      populate: { path: 'category', populate: { path: 'categoryType' } }
    });
  return account;
};

module.exports = { accounts, account };
