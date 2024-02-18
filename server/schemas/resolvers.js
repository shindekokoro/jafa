const {
  User,
  Account,
  Transaction,
  Institution,
  CategoryType,
  CategoryName,
  Payee
} = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    getUsers: async () => {
      return User.find().populate('accounts');
    },
    getUser: async (parent, { username }) => {
      return User.findOne({ username }).populate('accounts');
    },
    getAccounts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Account.find(params).sort({ accountName: -1 });
    },
    getAccount: async (parent, { accountId }) => {
      return Account.findOne({ _id: accountId });
    },
    getMe: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('accounts');
      }
      throw AuthenticationError;
    }
  },

  Mutation: {
    addUser: async (
      parent,
      { username, email, password }
    ) => {
      const user = await User.create({
        username,
        email,
        password
      });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    addInstitution: async (parent, { name, otherInfo }, context) => {
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
    },
    removeInstitution: async (parent, { institutionId }, context) => {
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
    },

    addCategoryType: async (parent, { categoryTypeName }, context) => {
      if (context.user) {
        const categoryType = await CategoryType.create({
          categoryTypeName,
          user: context.user._id
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { categoryTypes: categoryType._id } }
        );

        return categoryType;
      }
      throw AuthenticationError;
    },
    removeCategoryType: async (parent, { categoryTypeId }, context) => {
      if (context.user) {
        const categoryType = await CategoryType.findOneAndDelete({
          _id: categoryTypeId,
          user: context.user._id
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { categoryTypes: categoryType._id } }
        );

        return categoryType;
      }
      throw AuthenticationError;
    },

    addCategoryName: async (
      parent,
      { categoryName, categoryType },
      context
    ) => {
      if (context.user) {
        const category = await CategoryName.create({
          categoryName,
          categoryType,
          user: context.user._id
        });

        await CategoryType.findOneAndUpdate(
          { _id: categoryType },
          { $addToSet: { categories: category._id } }
        );

        return category;
      }
      throw AuthenticationError;
    },
    removeCategoryName: async (parent, { categoryId }, context) => {
      if (context.user) {
        const category = await CategoryName.findOneAndDelete({
          _id: categoryId,
          user: context.user._id
        });

        await CategoryType.findOneAndUpdate(
          { _id: category.categoryType },
          { $pull: { categories: category._id } }
        );

        return category;
      }
      throw AuthenticationError;
    },

    addPayee: async (parent, { name }, context) => {
      if (context.user) {
        const payee = await Payee.create({
          name,
          user: context.user._id
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { payees: payee._id } }
        );

        return payee;
      }
      throw AuthenticationError;
    },
    removePayee: async (parent, { payeeId }, context) => {
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
    },

    addAccount: async (
      parent,
      {
        accountName,
        description,
        institution,
        type,
        currency,
        startingBalance
      },
      context
    ) => {
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
    },
    removeAccount: async (parent, { accountId }, context) => {
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
    },

    addTransaction: async (
      parent,
      {
        accountId,
        purchaseDate,
        payee,
        category,
        amount,
        split,
        transfer,
        cleared,
        related
      },
      context
    ) => {
      if (context.user) {
        const transaction = await Transaction.create({
          accountId,
          purchaseDate,
          payee,
          category,
          amount,
          split,
          transfer,
          cleared,
          related,
          user: context.user._id
        });

        return Account.findOneAndUpdate(
          { _id: accountId },
          {
            $addToSet: { transactions: transaction._id }
          },
          {
            new: true,
            runValidators: true
          }
        );
      }
      throw AuthenticationError;
    },
    removeTransaction: async (
      parent,
      { accountId, transactionId },
      context
    ) => {
      if (context.user) {
        return Account.findOneAndUpdate(
          { _id: accountId },
          {
            $pull: {
              transactions: {
                _id: transactionId,
                user: context.user._id
              }
            }
          },
          { new: true }
        );
      }
      throw AuthenticationError;
    }
  }
};

module.exports = resolvers;
