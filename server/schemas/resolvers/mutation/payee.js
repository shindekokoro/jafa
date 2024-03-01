const { Payee, User } = require('../../../models');
const { AuthenticationError } = require('../../../utils/auth');

const addPayee = async (_, { name }, context) => {
  if (context.user) {
    const payee = await Payee.create({
      payeeName: name,
      user: context.user._id
    });

    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $addToSet: { payees: payee._id } }
    );

    return payee;
  }
  throw AuthenticationError;
};

const removePayee = async (_, { payeeId }, context) => {
  if (context.user) {
    const payee = await Payee.findOneAndDelete({
      _id: payeeId,
      user: context.user._id
    });

    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $pull: { payees: payee._id } }
    );

    return payee;
  }
  throw AuthenticationError;
};

module.exports = { addPayee, removePayee };
