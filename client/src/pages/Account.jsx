import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { ACCOUNT_QUERY, TRANSACTION_QUERY } from '../utils/queries';
import Auth from '../utils/auth';
import { Box, Typography } from '@mui/material';
import { TransactionsTable } from '../components';

export default function Account() {
  const {
    loading: accountLoading,
    data: accountData,
    error: accountError
  } = useQuery(ACCOUNT_QUERY, {
    variables: { account: useParams().id }
  });
  const {
    loading: transactionLoading,
    data: transactionData,
    error: transactionError
  } = useQuery(TRANSACTION_QUERY, {
    variables: { account: useParams().id }
  });
  if (accountLoading || transactionLoading) {
    return <Typography>Loading...</Typography>;
  }
  if (accountError || transactionError) {
    let error = accountError || transactionError;
    console.log(error.message);
    if (error.message === 'You are not authenticated.') {
      return <Navigate to="/logout" />;
    }
    console.log(error);
    throw error;
  }
  let { account } = accountData;
  let { transactions } = transactionData;
  // navigate to login if not logged in
  if (!Auth?.loggedIn()) {
    return <Navigate to="/login" />;
  }
  if (!account || !transactions) {
    throw new Error('Account or transactions not found');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5">
        {account.accountName} at {account.institution.institutionName}
      </Typography>
      <Typography variant="h6">{account.description}</Typography>
      <Box component="h3" sx={{ marginTop: 5 }}>
        Transactions
      </Box>
      <TransactionsTable transactions={transactions} account={account} />
    </Box>
  );
}
