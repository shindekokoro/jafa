const { Institution } = require('../../../models');
const { AuthenticationError } = require('../../../utils/auth');

const addInstitution = async (_, { name, otherInfo }, context) => {
  if (context.user) {
    const institution = await Institution.create({
      name,
      otherInfo,
      user: context.user._id
    });

    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $addToSet: { institutions: institution._id } }
    );

    return institution;
  }
  throw AuthenticationError;
};
const removeInstitution = async (_, { institutionId }, context) => {
  if (context.user) {
    const institution = await Institution.findOneAndDelete({
      _id: institutionId,
      user: context.user._id
    });

    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $pull: { institutions: institution._id } }
    );

    return institution;
  }
  throw AuthenticationError;
};

module.exports = { addInstitution, removeInstitution };
