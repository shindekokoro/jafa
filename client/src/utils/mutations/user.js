import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const UPDATE_USER_ACCOUNTS = gql`
  mutation updateUserAccounts($userId: ID!, $accounts: [ID]!) {
    updateUserAccounts(userId: $userId, accounts: $accounts) {
      _id
      accounts {
        _id
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser(
    $userId: ID!
    $username: String!
    $email: String!
    $password: String!
  ) {
    updateUser(
      userId: $userId
      username: $username
      email: $email
      password: $password
    ) {
      _id
      username
      email
    }
  }
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation updateUserPassword($userId: ID!, $password: String!) {
    updateUserPassword(userId: $userId, password: $password) {
      _id
    }
  }
`;

export const UPDATE_USER_USERNAME = gql`
  mutation updateUserUsername($userId: ID!, $username: String!) {
    updateUserUsername(userId: $userId, username: $username) {
      _id
    }
  }
`;

export const UPDATE_USER_EMAIL = gql`
  mutation updateUserEmail($userId: ID!, $email: String!) {
    updateUserEmail(userId: $userId, email: $email) {
      _id
    }
  }
`;

export const UPDATE_USER_TRANSACTIONS = gql`
  mutation updateUserTransactions($userId: ID!, $transactions: [ID]!) {
    updateUserTransactions(userId: $userId, transactions: $transactions) {
      _id
      transactions {
        _id
      }
    }
  }
`;

export const REMOVE_USER = gql`
  mutation removeUser($userId: ID!) {
    removeUser(userId: $userId) {
      _id
    }
  }
`;
