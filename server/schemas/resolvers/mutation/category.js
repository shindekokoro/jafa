const { CategoryType, CategoryName } = require('../../../models');
const { AuthenticationError } = require('../../../utils/auth');
const { categories, categoryTypes } = require('../query/category');

const addCategoryType = async (_, { categoryTypeInput }, context) => {
  let input = categoryTypeInput;
  delete input.transaction;
  if (context.user) {
    try {
      const categoryType = await CategoryType.create({
        ...input,
        user: context.user._id
      });

      const updatedCategoryTypes = await categoryTypes(null, null, context);

      return {
        code: 200,
        success: true,
        message: 'Category type added successfully',
        categoryType,
        categoryTypes: updatedCategoryTypes
      };
    } catch (error) {
      console.error(error);
      return {
        code: 400,
        success: false,
        message: `Error adding category type: ${categoryTypeInput}`
      };
    }
  }
  throw AuthenticationError;
};
const updateCategoryType = async (_, { updateCategoryTypeInput }, context) => {
  const { categoryTypeId } = updateCategoryTypeInput;
  if (context.user) {
    try {
      const categoryType = await CategoryType.findOneAndUpdate(
        { _id: categoryTypeId, user: context.user._id },
        { categoryTypeName: updateCategoryTypeInput.categoryTypeName },
        { new: true, runValidators: true }
      );

      return categoryType;
    } catch (error) {
      console.error(error);
      return {
        code: 400,
        success: false,
        message: `Error updating category type ${categoryTypeId} for ${context.user.username}`
      };
    }
  }
  throw AuthenticationError;
};
const removeCategoryType = async (_, { categoryTypeId }, context) => {
  if (context.user) {
    const categoryType = await CategoryType.findOneAndDelete({
      _id: categoryTypeId,
      user: context.user._id
    });

    return categoryType;
  }
  throw AuthenticationError;
};

const addCategoryName = async (_, { categoryNameInput }, context) => {
  console.log('addCategoryName categoryNameInput', categoryNameInput);
  let input = categoryNameInput;
  delete input.transaction;
  if (context.user) {
    try {
      const category = await CategoryName.create({
        ...input,
        user: context.user._id
      });

      const updatedCategories = await categories(null, null, context);

      return {
        code: 200,
        success: true,
        message: 'Category added successfully',
        category,
        categories: updatedCategories
      };
    } catch (error) {
      console.error(error);
      return {
        code: 400,
        success: false,
        message: `Error adding category: ${categoryNameInput}`
      };
    }
  }
  throw AuthenticationError;
};
const updateCategoryName = async (_, { updateCategoryNameInput }, context) => {
  const { categoryId } = updateCategoryNameInput;
  let input = { ...updateCategoryNameInput };
  // Remove fields that are NOT to be updated
  delete input.categoryId;
  if (context.user) {
    const category = await CategoryName.findOneAndUpdate(
      { _id: categoryId, user: context.user._id },
      { ...input },
      { new: true, runValidators: true }
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

    return category;
  }
  throw AuthenticationError;
};

module.exports = {
  addCategoryType,
  updateCategoryType,
  removeCategoryType,
  addCategoryName,
  updateCategoryName,
  removeCategoryName
};
