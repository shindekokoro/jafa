const { CategoryType, User, CategoryName } = require('../../../models');
const { AuthenticationError } = require('../../../utils/auth');

const addCategoryType = async (_, { categoryTypeName }, context) => {
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
};
const removeCategoryType = async (_, { categoryTypeId }, context) => {
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
};

const addCategoryName = async (_, { categoryName, categoryType }, context) => {
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
};

const removeCategoryName = async (_, { categoryId }, context) => {
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
};

module.exports = {
  addCategoryType,
  removeCategoryType,
  addCategoryName,
  removeCategoryName
};
