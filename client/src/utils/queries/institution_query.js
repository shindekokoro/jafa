import { gql } from '@apollo/client';

export const INSTITUTIONS_QUERY = gql`
query Institutions {
  institutions {
    _id
    institutionName
  }
}
`;