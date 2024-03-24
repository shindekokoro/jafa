const { Account, User, Institution, Transaction } = require('../../../models');
const { AuthenticationError } = require('../../../utils/auth');
const { findAndDeleteMany } = require('../../../utils/helpers');
const { account, accounts } = require('../query/account');

const addAccount = async (_, { addAccountInput }, context) => {
  const { accountName, institution } = addAccountInput;

  if (context.user) {
    try {
      const createdAccount = await Account.create({
        ...addAccountInput,
        user: context.user._id
      });

      const updatedInstitution = await Institution.findOneAndUpdate(
        { _id: institution },
        { $addToSet: { accounts: createdAccount._id } },
        {
          new: true,
          runValidators: true
        }
      );

      if (!updatedInstitution) {
        console.warn(
          `Error updating institution with the account ${accountName} (${createdAccount._id})`
        );
      }

      await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { accounts: createdAccount._id } }
      );

      let newAccount = await account(null, { account: createdAccount._id }, context);
      let updatedAccounts = await accounts(null, null, context);

      return {
        code: 200,
        success: true,
        message: `Added account ${account._id} for ${context.user.username}`,
        account: newAccount,
        accounts: updatedAccounts
      };
    } catch (error) {
      console.error(error);
      return {
        code: 400,
        success: false,
        message: `Error adding account ${accountName} for ${context.user.username}`
      };
    }
  }
  throw AuthenticationError;
};
const removeAccount = async (_, { account }, context) => {
  if (context.user) {
    const removedAccount = await Account.findOneAndDelete({
      _id: account,
      user: context.user._id
    });

    // Remove the account from the user's account array
    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $pull: { account: account } }
    );

    // Remove all transactions associated with the account and store the Removed Transaction IDs
    let removeTransactions = await findAndDeleteMany(Transaction, {
      account: account,
      user: context.user._id
    });
    // Remove the transactions from the user's transactions array
    let removedTransactions = [];
    removeTransactions?.forEach(async (transaction) => {
      await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { transactions: transaction._id } }
      );
      removedTransactions.push(transaction._id.toString());
    });
    // Get updated list of accounts associated with the user
    const updatedAccounts = await accounts(null, null, context);

    return {
      code: removedAccount ? 200 : 404,
      success: removedAccount ? true : false,
      message: removedAccount
        ? `Removed account ${account} for ${context.user.username}`
        : `Account doesn't exist or you don't have permission to remove it`,
      account: removedAccount,
      accounts: updatedAccounts
    };
  }
  throw AuthenticationError;
};

module.exports = { addAccount, removeAccount };
