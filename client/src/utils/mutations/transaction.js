import { gql } from '@apollo/client';

export const ADD_TRANSACTION = gql`
mutation AddTransaction($addTransactionInput: addTransactionInput) {
  addTransaction(addTransactionInput: $addTransactionInput) {
      code
      success
      message
      transactions {
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
      account {
        _id
      }
    }
}
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($updateTransactionInput: updateTransactionInput) {
    updateTransaction(updateTransactionInput: $updateTransactionInput) {
      code
      success
      message
      transactions {
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
      account {
        _id
      }
    }
  }
`;

export const REMOVE_TRANSACTION = gql`
  mutation RemoveTransaction($accountId: ID!, $transactionId: ID!) {
    removeTransaction(accountId: $accountId, transactionId: $transactionId) {
      code
      message
      success
      transactions {
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
      }
      account {
        _id
      }
    }
  }
`;
