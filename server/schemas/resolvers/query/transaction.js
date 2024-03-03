const { Transaction } = require('../../../models');

const transaction = async (_, { account, transaction }) => {
  let transactionSearched = await Transaction.findOne({ _id: transaction, account })
    .populate({ path: 'payee' })
    .populate({ path: 'category'})
    .populate({ path: 'categoryType' });
  return transactionSearched;
}

const transactions = async (_, { account }) => {
  let transactionsSearched = await Transaction.find({ account })
    .populate({ path: 'payee' })
    .populate({ path: 'category'})
    .populate({ path: 'categoryType' })
    .sort({ purchaseDate: -1 })
    .sort({ payee: 1 });
  return transactionsSearched;
}

module.exports = {transaction, transactions};