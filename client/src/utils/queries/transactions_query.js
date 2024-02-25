import { gql } from '@apollo/client';

export const TRANSACTION_QUERY = gql`
query Transactions($accountId: ID!) {
  transactions(accountId: $accountId) {
    _id
    purchaseDate
    payee {
      payeeName
    }
    category {
      categoryName
      categoryType {
        categoryTypeName
      }
    }
    amount
    cleared
  }
}
`;
