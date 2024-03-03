import { gql } from '@apollo/client';

export const ACCOUNT_QUERY = gql`
  query Account($account: ID!) {
    account(account: $account) {
      _id
      accountName
      currency
      description
      institution {
        institutionName
        otherInfo
      }
      transactions {
        _id
        purchaseDate
        cleared
        payee {
          _id
          payeeName
        }
        category {
          categoryName
          
        }
        categoryType {
          categoryTypeName
        }
        amount
      }
    }
  }
`;
