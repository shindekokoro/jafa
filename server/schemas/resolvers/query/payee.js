const { Payee } = require("../../../models");
const { AuthenticationError } = require("../../../utils/auth");

const payees = async (parent, args, context) => {
  console.log(context.user._id);
  if (context.user) {
    let userPayees = await Payee.find({ user: context.user._id });
    return userPayees;
  }
  throw new AuthenticationError('You are not authenticated');
}

module.exports = payees;