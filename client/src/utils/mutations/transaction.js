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
        }
        categoryType {
          _id
          categoryTypeName
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
        }
        categoryType {
          _id
          categoryTypeName
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
mutation RemoveTransaction($removeTransactionInput: removeTransactionInput) {
  removeTransaction(removeTransactionInput: $removeTransactionInput) {
    code
    success
    message
    account {
      _id
    }
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
        }
        categoryType {
          _id
          categoryTypeName
        }
        amount
        cleared
        account {
          _id
        }
      }
  }
}
`;
