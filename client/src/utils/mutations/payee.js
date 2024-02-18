import { gql } from '@apollo/client';

export const ADD_PAYEE = gql`
  mutation addPayee($name: String!) {
    addPayee(name: $name) {
      _id
      name
    }
  }
`;

export const UPDATE_PAYEE = gql`
  mutation updatePayee($payeeId: ID!, $name: String!) {
    updatePayee(payeeId: $payeeId, name: $name) {
      _id
      name
    }
  }
`;

export const REMOVE_PAYEE = gql`
  mutation removePayee($payeeId: ID!) {
    removePayee(payeeId: $payeeId) {
      _id
    }
  }
`;
