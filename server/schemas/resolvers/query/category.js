const { CategoryName, CategoryType } = require("../../../models");
const { AuthenticationError } = require("../../../utils/auth");

const categories = async (_, __, context) => {
  if (context.user) {
    let userCategories = await CategoryName.find({ user: context.user._id })
      .sort({ categoryName: 1 });
    return userCategories;
  }
  throw new AuthenticationError('You are not authenticated');
}

const categoryTypes = async (_, __, context) => {
  if (context.user) {
    let userCategoryTypes = await CategoryType.find({ user: context.user._id })
      .sort({ categoryTypeName: 1 });
    return userCategoryTypes;
  }
  throw new AuthenticationError('You are not authenticated');
}

module.exports = {categories, categoryTypes};