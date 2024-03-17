const {
  Account,
  Transaction,
  User,
  CategoryType,
  CategoryName
} = require('../../../models');
const { AuthenticationError } = require('../../../utils/auth');
const { transaction, transactions } = require('../query/transaction');

const addTransaction = async (_, { addTransactionInput }, context) => {
  if (context.user) {
    const newTransaction = await Transaction.create({
      ...addTransactionInput,
      user: context.user._id
    });
    updateSets(newTransaction);

    let updatedTransactions = await transactions(
      null,
      { account: addTransactionInput.account },
      context
    );
    return {
      code: 200,
      success: true,
      message: `Added transaction ${newTransaction._id} for ${context.user.username}`,
      transaction: newTransaction,
      transactions: updatedTransactions
    };
  }
  throw AuthenticationError;
};

const updateTransaction = async (_, { updateTransactionInput }, context) => {
  const { transaction, account } = updateTransactionInput;
  let input = { ...updateTransactionInput };
  // Remove fields that are NOT to be updated
  delete input.account;
  delete input.transaction;
  if (context.user) {
    try {
      const transactionResponse = await Transaction.findOneAndUpdate(
        { _id: transaction, account: { _id: account } },
        { ...input }
      );
      updateSets(transactionResponse);

      let updatedTransactions = await transactions(null, { account: account }, context);
      return {
        code: transaction ? 200 : 400,
        success: transactionResponse ? true : false,
        message: transactionResponse
          ? `Updated transaction ${transaction} for ${context.user.username}`
          : `Error updating transaction ${transaction} for ${context.user.username}`,
        transactions: updatedTransactions
      };
    } catch (error) {
      console.error(error);
      return {
        code: 400,
        success: false,
        message: `Error updating transaction ${transaction} for ${context.user.username}`,
        transactions: null
      };
    }
  }
  return {
    code: 403,
    success: false,
    message: `You must be logged in to update a transaction.`,
    transactions: null
  };
};

const removeTransaction = async (_, { removeTransactionInput }, context) => {
  const { transaction, account } = removeTransactionInput;
  if (context.user) {
    let removedTransaction = await Transaction.findOneAndDelete({
      _id: transaction,
      user: context.user._id
    });
    if (!removedTransaction) {
      return {
        code: 404,
        success: false,
        message: `Transaction ${transaction} not found. Doesn't exist or doesn't belong to logged in user: ${context.user.username}`,
        transactions: null,
        account: { _id: account }
      };
    }
    let { removedUser, removedAccount, removedCategory, removedCategoryType } = removeSets(removedTransaction);

    let updatedTransactions = await transactions(null, { account }, context);

    return {
      code: 200,
      success: true,
      message: `Removed ${transaction} from ${updatedAccount.accountName} belonging to ${context.user.username}`,
      transaction: removedTransaction,
      transactions: updatedTransactions,
      account: removedAccount
    };
  }
  throw AuthenticationError;
};

const updateSets = async (transaction) => {
  const user = await User.findOneAndUpdate(
    { _id: transaction.user },
    { $addToSet: { transactions: transaction._id } },
    {
      new: true,
      runValidators: true
    }
  );
  const account = await Account.findOneAndUpdate(
    { _id: transaction.account },
    { $addToSet: { transactions: transaction._id } },
    {
      new: true,
      runValidators: true
    }
  );
  const category = await CategoryName.findOneAndUpdate(
    { _id: transaction.category },
    { $addToSet: { transactions: transaction._id } },
    {
      new: true,
      runValidators: true
    }
  );
  const categoryType = await CategoryType.findOneAndUpdate(
    { _id: transaction.categoryType },
    { $addToSet: { transactions: transaction._id } },
    {
      new: true,
      runValidators: true
    }
  );

  return { updatedUser: user, updatedAccount: account, updatedCategory: category, updatedCategoryType: categoryType };
};

const removeSets = async (transaction) => {
  const user = await User.findOneAndUpdate(
    { _id: transaction.user },
    { $pull: { transactions: transaction._id } },
    {
      new: true,
      runValidators: true
    }
  );
  const account = await Account.findOneAndUpdate(
    { _id: transaction.account },
    { $pull: { transactions: transaction._id } },
    {
      new: true,
      runValidators: true
    }
  );
  const category = await CategoryName.findOneAndUpdate(
    { _id: transaction.category },
    { $pull: { transactions: transaction._id } },
    {
      new: true,
      runValidators: true
    }
  );
  const categoryType = await CategoryType.findOneAndUpdate(
    { _id: transaction.categoryType },
    { $pull: { transactions: transaction._id } },
    {
      new: true,
      runValidators: true
    }
  );

  return { removedUser: user, removedAccount: account, removedCategory: category, removedCategoryType: categoryType };
};

module.exports = { addTransaction, updateTransaction, removeTransaction };
