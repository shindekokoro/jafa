import { gql } from '@apollo/client';

export const CATEGORY_QUERY = gql`
query Categories {
  categories {
    _id
    categoryName
  }
}
`;

export const CATEGORY_TYPE_QUERY = gql`
query CategoryTypes {
  categoryTypes {
    _id
    categoryTypeName
  }
}
`;