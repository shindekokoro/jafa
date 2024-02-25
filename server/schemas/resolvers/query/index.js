const user = require('./user');
const payees = require('./payee');
const transactions = require('./transaction');
const { account, accounts } = require('./account');

const Query = {
  user,
  payees,
  account,
  accounts,
  transactions
};
console.log('Query', Query);
module.exports = Query;
