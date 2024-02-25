import { gql } from '@apollo/client';

export const PAYEE_QUERY = gql`
query Payees {
  payees {
    _id
    payeeName
  } 
}
`;