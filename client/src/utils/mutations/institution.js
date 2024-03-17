import { gql } from '@apollo/client';

export const ADD_INSTITUTION = gql`
  mutation AddInstitution($institutionInput: institutionInput!) {
    addInstitution(institutionInput: $institutionInput) {
      code
      success
      message
      institution {
        _id
        institutionName
      }
      institutions {
        _id
        institutionName
      }
    }
  }
`;

export const UPDATE_INSTITUTION = gql`
  mutation updateInstitution($institutionId: ID!, $name: String!, $otherInfo: String) {
    updateInstitution(institutionId: $institutionId, name: $name, otherInfo: $otherInfo) {
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
