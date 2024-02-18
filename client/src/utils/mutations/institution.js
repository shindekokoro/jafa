import { gql } from '@apollo/client';

export const ADD_INSTITUTION = gql`
  mutation addInstitution($name: String!, $otherInfo: String) {
    addInstitution(name: $name, otherInfo: $otherInfo) {
      _id
      name
      otherInfo
    }
  }
`;

export const UPDATE_INSTITUTION = gql`
  mutation updateInstitution(
    $institutionId: ID!
    $name: String!
    $otherInfo: String
  ) {
    updateInstitution(
      institutionId: $institutionId
      name: $name
      otherInfo: $otherInfo
    ) {
      _id
      name
      otherInfo
    }
  }
`;

export const REMOVE_INSTITUTION = gql`
  mutation removeInstitution($institutionId: ID!) {
    removeInstitution(institutionId: $institutionId) {
      _id
    }
  }
`;
