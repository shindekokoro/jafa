const user = require('./user');
const payees = require('./payee');
const { categories, categoryTypes } = require('./category');
const {transaction, transactions} = require('./transaction');
const { institution, institutions } = require('./institution');
const { account, accounts } = require('./account');

const Query = {
  user,
  payees,
  categories,
  categoryTypes,
  account,
  accounts,
  institution,
  institutions,
  transaction,
  transactions
};

module.exports = Query;
