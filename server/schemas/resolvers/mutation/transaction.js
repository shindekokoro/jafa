const { Account, Transaction, User } = require('../../../models');
const { AuthenticationError } = require('../../../utils/auth');
const { transaction, transactions } = require('../query/transaction');

const addTransaction = async (_, { addTransactionInput }, context) => {
  let input = {...addTransactionInput};
  console.log('addTransactionInput', input);
  if (context.user) {
    const transaction = await Transaction.create(
      {
      ...addTransactionInput,
      user: context.user._id
    });

    const account = await Account.findOneAndUpdate(
      { _id: addTransactionInput.account },
      {
        $addToSet: { transactions: transaction._id }
      },
      {
        new: true,
        runValidators: true
      }
    );
    let updatedTransactions = await transactions(null, { accountId: account }, context);
    console.log('updatedTransactions', updatedTransactions);
    return {
      code: 200,
      success: true,
      message: `Added transaction ${transaction._id} for ${context.user.username}`,
      transaction,
      transactions: updatedTransactions
    }
  }
  throw AuthenticationError;
};

const updateTransaction = async (_, { updateTransactionInput }, context) => {
  const { transactionId, account } = updateTransactionInput;
  let input = {...updateTransactionInput};
  // Remove fields that are NOT to be updated
  delete input.account;
  delete input.transactionId;
  if (context.user) {
    try {
      const transactionResponse = await Transaction.findOneAndUpdate(
        { _id: transactionId, account: { _id: account } },
        {...input}
      );
      let updatedTransactions = await transactions(null, { accountId: account }, context);
      return {
        code: transaction ? 200 : 400,
        success: transactionResponse ? true : false,
        message: transactionResponse
          ? `Updated transaction ${transactionId} for ${context.user.username}`
          : `Error updating transaction ${transactionId} for ${context.user.username}`,
        transactions: updatedTransactions
      };
    } catch (error) {
      console.error(error);
      return {
        code: 400,
        success: false,
        message: `Error updating transaction ${transactionId} for ${context.user.username}`,
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

const removeTransaction = async (_, { accountId, transactionId }, context) => {
  if (context.user) {
    let transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      user: context.user._id
    });
    if (!transaction) {
      return {
        code: 404,
        success: false,
        message: `Transaction ${transactionId} not found. Doesn't exist or doesn't belong to logged in user: ${context.user.username}`,
        transactions: null,
        account: null
      };
    }
    let user = await User.findOneAndUpdate(
      { _id: context.user._id },
      {
        $pull: {
          transactions: transactionId
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
    let account = await Account.findOneAndUpdate(
      { _id: accountId },
      {
        $pull: {
          transactions: {
            _id: transactionId,
            user: context.user._id
          }
        }
      },
      { new: true }
    );
    if (!account) {
      return {
        code: 400,
        success: false,
        message: `Transaction already removed from account. This is an unexpected error.`,
        transactions: null,
        account: null
      };
    }
    let updatedTransactions = await transactions(null, { accountId }, context);

    return {
      code: 200,
      success: true,
      message: `Removed ${transactionId} from ${account.accountName} belonging to ${context.user.username}`,
      transactions: updatedTransactions,
      account
    };
  }
  throw AuthenticationError;
};

module.exports = { addTransaction, updateTransaction, removeTransaction };
