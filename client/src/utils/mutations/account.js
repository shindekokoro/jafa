import { gql } from '@apollo/client';

export const ADD_ACCOUNT = gql`
  mutation addAccount(
    $accountName: String!
    $description: String
    $institution: ID!
    $type: String!
    $currency: String!
    $startingBalance: Float!
  ) {
    addAccount(
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

export const REMOVE_ACCOUNT = gql`
  mutation removeAccount($accountId: ID!) {
    removeAccount(accountId: $accountId) {
      _id
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation updateAccount(
    $accountID: ID!,
    $accountName: String,
    $description: String,
    $institution: ID,
    $type: String,
    $currency: String,
    $startingBalance: Float
  ) {
    updateAccount(
      accountID: $accountID,
      accountName: $accountName,
      description: $description,
      institution: $institution,
      type: $type,
      currency: $currency,
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
