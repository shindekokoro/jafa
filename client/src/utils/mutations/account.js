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
  mutation removeAccount($account: ID!) {
    removeAccount(account: $account) {
      _id
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation updateAccount(
    $account: ID!,
    $accountName: String,
    $description: String,
    $institution: ID,
    $type: String,
    $currency: String,
    $startingBalance: Float
  ) {
    updateAccount(
      account: $account,
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
