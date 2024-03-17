const { Account, User, Institution } = require('../../../models');
const { AuthenticationError } = require('../../../utils/auth');
const { account, accounts } = require('../query/account');

const addAccount = async (_, { addAccountInput }, context) => {
  const { accountName, description, institution, type, currency, startingBalance } =
    addAccountInput;

  if (context.user) {
    try {
      const createdAccount = await Account.create({
        accountName,
        description,
        institution,
        type,
        currency,
        startingBalance,
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
      let updatedAccounts = await accounts(null, { user: context.user._id }, context);

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
  ('You need to be logged in!');
};
const removeAccount = async (_, { account }, context) => {
  if (context.user) {
    const removedAccount = await Account.findOneAndDelete({
      _id: account,
      user: context.user._id
    });

    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $pull: { account: account._id } }
    );

    const updatedAccounts = await accounts(null, { user: context.user._id }, context);

    return {
      code: removedAccount ? 200 : 400,
      success: removedAccount ? true : false,
      message: removedAccount ? `Removed account ${account} for ${context.user.username}` : `Error removing account ${account} for ${context.user.username}`,
      account: removedAccount,
      accounts: updatedAccounts
    };
  }
  throw AuthenticationError;
};

module.exports = { addAccount, removeAccount };
