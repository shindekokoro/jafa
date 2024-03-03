const { Account, Transaction, User, CategoryType, CategoryName } = require('../../../models');
const { AuthenticationError } = require('../../../utils/auth');
const { transaction, transactions } = require('../query/transaction');

const addTransaction = async (_, { addTransactionInput }, context) => {
  if (context.user) {
    const newTransaction = await Transaction.create(
      {
      ...addTransactionInput,
      user: context.user._id
    });

    const account = await Account.findOneAndUpdate(
      { _id: addTransactionInput.account },
      { $addToSet: { transactions: newTransaction._id } },
      {
        new: true,
        runValidators: true
      }
    );
    let updatedTransactions = await transactions(null, { account: addTransactionInput.account }, context);
    console.log('updatedTransactions', updatedTransactions);
    return {
      code: 200,
      success: true,
      message: `Added transaction ${newTransaction._id} for ${context.user.username}`,
      transaction,
      transactions: updatedTransactions
    }
  }
  throw AuthenticationError;
};

const updateTransaction = async (_, { updateTransactionInput }, context) => {
  const { transaction, account } = updateTransactionInput;
  let input = {...updateTransactionInput};
  // Remove fields that are NOT to be updated
  delete input.account;
  delete input.transaction;
  if (context.user) {
    try {
      const transactionResponse = await Transaction.findOneAndUpdate(
        { _id: transaction, account: { _id: account } },
        {...input}
      );
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
  const { transaction, account, category, categoryType } = removeTransactionInput;
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
        account: null
      };
    }
    let updatedCategory = await CategoryName.findOneAndUpdate(
      { _id: category },
      {
        $pull: {
          transactions: transaction
        }
      },
      { new: true }
    );
    let updatedCategoryType = await CategoryType.findOneAndUpdate(
      { _id: categoryType },
      {
        $pull: {
          transactions: transaction
        }
      },
      { new: true }
    );
    let user = await User.findOneAndUpdate(
      { _id: context.user._id },
      {
        $pull: {
          transactions: transaction
        }
      },
      { new: true }
    );
    if (!user) {
      return {
        code: 400,
        success: false,
        message: `Transaction already removed from user. This is an unexpected error.`,
        transactions: null,
        account: null
      };
    }
    let updatedAccount = await Account.findOneAndUpdate(
      { _id: account },
      {
        $pull: {
          transactions: {
            _id: transaction,
            user: context.user._id
          }
        }
      },
      { new: true }
    );
    if (!updatedAccount) {
      return {
        code: 400,
        success: false,
        message: `Transaction already removed from account. This is an unexpected error.`,
        transactions: null,
        account: null
      };
    }
    let updatedTransactions = await transactions(null, { account }, context);

    return {
      code: 200,
      success: true,
      message: `Removed ${transaction} from ${updatedAccount.accountName} belonging to ${context.user.username}`,
      transactions: updatedTransactions,
      account
    };
  }
  throw AuthenticationError;
};

module.exports = { addTransaction, updateTransaction, removeTransaction };
