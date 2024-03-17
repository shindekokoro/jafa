const { Institution, User } = require('../../../models');
const { AuthenticationError } = require('../../../utils/auth');
const { institution, institutions } = require('../query/institution');

const addInstitution = async (_, { institutionInput }, context) => {
  if (context.user) {
try {    const institution = await Institution.create({
      ...institutionInput,
      user: context.user._id
    });

    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $addToSet: { institutions: institution._id } }
    );
    
    let userInstitutions = await institutions(null, null, context);

    return {
      code: 201,
      success: true,
      message: 'Institution added',
      institution,
      institutions: userInstitutions
    };}
    catch (error) {
      console.error('Error adding institution', error);
      if (error.code === 11000) {
        let institution = await Institution.findOne({ institutionName: institutionInput.institutionName });
        return {
          code: 200,
          success: true,
          message: `Institution ${institutionInput.institutionName} already exists`,
          institution
        };
      }
      return undefined;
    }
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
