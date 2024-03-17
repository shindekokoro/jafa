const { Institution } = require('../../../models');
const { AuthenticationError } = require('../../../utils/auth');

const institution = async (_, { institution }, context) => {
  if (context.user) {
    let searchedInstitution = await Institution.find({
      user: context.user._id,
      _id: institution
    })
      .sort({ categoryName: 1 });
    return searchedInstitution;
  }
  throw new AuthenticationError('You are not authenticated');
};

const institutions = async (_, __, context) => {
  if (context.user) {
    let userInstitutions = await Institution.find({ user: context.user._id })
      .sort({ institutionName: 1 });

    return userInstitutions;
  }
  throw new AuthenticationError('You are not authenticated');
};

module.exports = { institution, institutions };
