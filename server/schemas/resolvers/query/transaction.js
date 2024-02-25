const { Transaction } = require('../../../models');

const transactions = async (parent, { accountId }) => {
  let transactions = await Transaction.find({ account: accountId })
    .populate({ path: 'payee' })
    .populate({ path: 'category', populate: { path: 'categoryType' } })
    .sort({ purchaseDate: -1 });
  return transactions;
}

module.exports = transactions;