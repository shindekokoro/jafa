const { Account, User } = require("../../../models");
const { AuthenticationError } = require("../../../utils/auth");

const addAccount = async (_, { addTransactionInput }, context ) => {
  const { accountId, purchaseDate, payee, category, amount, split, cleared, related } = addTransactionInput;
  if (context.user) {
    const account = await Account.create({
      accountName,
      description,
      institution,
      type,
      currency,
      startingBalance,
      user: context.user._id
    });

    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $addToSet: { accounts: account._id } }
    );

    return account;
  }
  throw AuthenticationError;
  ('You need to be logged in!');
}
const removeAccount = async (_, { accountId }, context) => {
  if (context.user) {
    const account = await Account.findOneAndDelete({
      _id: accountId,
      user: context.user._id
    });

    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $pull: { account: account._id } }
    );

    return account;
  }
  throw AuthenticationError;
}

module.exports = { addAccount, removeAccount };