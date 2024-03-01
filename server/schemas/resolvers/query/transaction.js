const { Transaction } = require('../../../models');

const transaction = async (_, { accountId, transactionId }) => {
  let transaction = await Transaction.findOne({ _id: transactionId, account: accountId })
    .populate({ path: 'payee' })
    .populate({ path: 'category', populate: { path: 'categoryType' } });
  return transaction;
}

const transactions = async (_, { accountId }) => {
  let transactions = await Transaction.find({ account: accountId })
    .populate({ path: 'payee' })
    .populate({ path: 'category', populate: { path: 'categoryType' } })
    .sort({ purchaseDate: -1 });
  return transactions;
}

module.exports = {transaction, transactions};