import { gql } from '@apollo/client';

export const ADD_TRANSACTION = gql`
  mutation addTransaction(
    $account: ID!
    $purchaseDate: String!
    $payee: ID!
    $category: ID!
    $amount: Float!
    $split: Boolean!
    $related: ID
    $cleared: Boolean!
  ) {
    addTransaction(
      account: $account
      purchaseDate: $purchaseDate
      payee: $payee
      category: $category
      amount: $amount
      split: $split
      related: $related
      cleared: $cleared
    ) {
      _id
      account {
        _id
      }
      purchaseDate
      payee {
        _id
      }
      category {
        _id
      }
      amount
      split
      related {
        _id
      }
      cleared
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation updateTransaction(
    $transactionId: ID!
    $account: ID
    $purchaseDate: String
    $payee: ID
    $category: ID
    $amount: Float
    $split: Boolean
    $related: ID
    $cleared: Boolean
  ) {
    updateTransaction(
      transactionId: $transactionId
      account: $account
      purchaseDate: $purchaseDate
      payee: $payee
      category: $category
      amount: $amount
      split: $split
      related: $related
      cleared: $cleared
    ) {
      _id
      account {
        _id
      }
      purchaseDate
      payee {
        _id
      }
      category {
        _id
      }
      amount
      split
      related {
        _id
      }
      cleared
    }
  }
`;

export const REMOVE_TRANSACTION = gql`
  mutation RemoveTransaction($accountId: ID!, $transactionId: ID!) {
    removeTransaction(accountId: $accountId, transactionId: $transactionId) {
      code
      message
      success
      transaction {
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
      account {
        _id
      }
    }
  }
`;
