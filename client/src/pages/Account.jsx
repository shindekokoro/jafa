import { Link, Navigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { ACCOUNT_QUERY } from '../utils/queries';

import Auth from '../utils/auth';
import { Box, Typography } from '@mui/material';
import convertDate from '../utils/convertDate';

export default function Account() {
  const { loading, data, error } = useQuery(ACCOUNT_QUERY, {
    variables: { accountId: useParams().id }
  });
  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (error) {
    console.log(error.message);
    if (error.message === 'You are not authenticated.') {
      return <Navigate to="/logout" />;
    }
    console.log(error);
    throw error;
  }
  let { account } = data;
  // navigate to login if not logged in
  if (!Auth?.loggedIn()) {
    return <Navigate to="/login" />;
  }
  console.log(account);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h3">
        {account.accountName} at {account.institution.institutionName}
      </Typography>
      <Typography variant="h6">{account.description}</Typography>
      <br />
      <Typography variant="h5">Transactions</Typography>
      {account.transactions.length ? (
        account.transactions.map((transaction) => (
          <Box key={transaction._id}>
            <Typography variant="h6">
              {convertDate(transaction.purchaseDate)} -{' '}
              {transaction.payee.payeeName} -{' '}
              {transaction.category.categoryName} -{' '}
              {transaction.category.categoryType.categoryTypeName}
            </Typography>
            <Typography variant="body1">{transaction.split}</Typography>
          </Box>
        ))
      ) : (
        <Typography variant="h6">You have no transactions.</Typography>
      )}
    </Box>
  );
}
