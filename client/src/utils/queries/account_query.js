import { gql } from '@apollo/client';

export const ACCOUNT_QUERY = gql`
  query account($accountId: ID!) {
    account(accountId: $accountId) {
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
        split
        category {
          categoryName
          categoryType {
            categoryTypeName
          }
        }
      }
    }
  }
`;
