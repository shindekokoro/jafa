const { Payee } = require("../../../models");
const { AuthenticationError } = require("../../../utils/auth");

const payees = async (_, __, context) => {
  if (context.user) {
    let userPayees = await Payee.find({ user: context.user._id }).sort({ payeeName: 1 });
    return userPayees;
  }
  throw new AuthenticationError('You are not authenticated');
}

module.exports = payees;