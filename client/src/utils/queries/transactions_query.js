import { gql } from '@apollo/client';

export const TRANSACTION_QUERY = gql`
query Transactions($accountId: ID!) {
  transactions(accountId: $accountId) {
    _id
    purchaseDate
    payee {
      _id
      payeeName
    }
    category {
      _id
      categoryName
      categoryType {
        _id
        categoryTypeName
      }
    }
    amount
    cleared
    account {
      _id
    }
  }
}
`;
