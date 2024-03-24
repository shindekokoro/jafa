import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query me {
    user {
      _id
      username
      email
      accounts {
        _id
        accountName
        description
        institution {
          _id
          institutionName
        }
        type
        currency
        startingBalance
        calculatedBalance
      }
    }
  }
`;