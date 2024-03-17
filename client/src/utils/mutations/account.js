import { gql } from '@apollo/client';

export const ADD_ACCOUNT = gql`
  mutation AddAccount($addAccountInput: addAccountInput) {
    addAccount(addAccountInput: $addAccountInput) {
      code
      success
      message
      account {
        _id
        accountName
        currency
        description
        institution {
          _id
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
      accounts {
        _id
        accountName
        currency
        description
        institution {
          _id
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
  }
`;

export const REMOVE_ACCOUNT = gql`
  mutation RemoveAccount($account: ID!) {
    removeAccount(account: $account) {
      code
      success
      message
      account {
        _id
        accountName
        description
        institution {
          _id
        }
        type
        currency
        startingBalance
      }
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
      }
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation updateAccount(
    $account: ID!
    $accountName: String
    $description: String
    $institution: ID
    $type: String
    $currency: String
    $startingBalance: Float
  ) {
    updateAccount(
      account: $account
      accountName: $accountName
      description: $description
      institution: $institution
      type: $type
      currency: $currency
      startingBalance: $startingBalance
    ) {
      _id
      accountName
      description
      institution {
        _id
      }
      type
      currency
      startingBalance
    }
  }
`;
