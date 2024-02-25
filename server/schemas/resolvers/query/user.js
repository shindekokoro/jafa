const { User } = require('../../../models');
const { AuthenticationError } = require('../../../utils/auth');

const user = async (_, __, context) => {
  if (context.user) {
    return User.findOne({ _id: context.user._id }).populate({
      path: 'accounts',
      populate: { path: 'institution' }
    });
  }
  throw new AuthenticationError('You are not authenticated.');
};

module.exports = user;