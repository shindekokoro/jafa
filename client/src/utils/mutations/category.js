import { gql } from '@apollo/client';

export const ADD_CATEGORY_NAME = gql`
  mutation AddCategoryName($categoryNameInput: categoryNameInput) {
    addCategoryName(categoryNameInput: $categoryNameInput) {
      code
      success
      message
      category {
        _id
        categoryName
      }
      categories {
        _id
        categoryName
      }
    }
  }
`;

export const UPDATE_CATEGORY_NAME = gql`
  mutation updateCategoryName(
    $categoryId: ID!
    $categoryName: String
    $categoryType: ID
  ) {
    updateCategoryName(
      categoryId: $categoryId
      categoryName: $categoryName
      categoryType: $categoryType
    ) {
      _id
      categoryName
      categoryType {
        _id
      }
    }
  }
`;

export const REMOVE_CATEGORY_NAME = gql`
  mutation removeCategoryName($categoryId: ID!) {
    removeCategoryName(categoryId: $categoryId) {
      _id
    }
  }
`;

export const ADD_CATEGORY_TYPE = gql`
  mutation AddCategoryType($categoryTypeInput: categoryTypeInput) {
    addCategoryType(categoryTypeInput: $categoryTypeInput) {
      code
      success
      message
      categoryType {
        _id
        categoryTypeName
      }
      categoryTypes {
        _id
        categoryTypeName
      }
    }
  }
`;

export const UPDATE_CATEGORY_TYPE = gql`
  mutation updateCategoryType($categoryTypeId: ID!, $categoryTypeName: String!) {
    updateCategoryType(
      categoryTypeId: $categoryTypeId
      categoryTypeName: $categoryTypeName
    ) {
      _id
      categoryTypeName
    }
  }
`;

export const REMOVE_CATEGORY_TYPE = gql`
  mutation removeCategoryType($categoryTypeId: ID!) {
    removeCategoryType(categoryTypeId: $categoryTypeId) {
      _id
    }
  }
`;
