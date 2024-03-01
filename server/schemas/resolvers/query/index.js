const user = require('./user');
const payees = require('./payee');
const { categories, categoryTypes } = require('./category');
const {transaction, transactions} = require('./transaction');
const { account, accounts } = require('./account');

const Query = {
  user,
  payees,
  categories,
  categoryTypes,
  account,
  accounts,
  transaction,
  transactions
};

module.exports = Query;
