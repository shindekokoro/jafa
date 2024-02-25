import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { ACCOUNT_QUERY, TRANSACTION_QUERY } from '../utils/queries';
import Auth from '../utils/auth';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { TransactionsTable } from '../components';

export default function Account() {
  const {
    loading: accountLoading,
    data: accountData,
    error: accountError
  } = useQuery(ACCOUNT_QUERY, {
    variables: { accountId: useParams().id }
  });
  const {
    loading: transactionLoading,
    data: transactionData,
    error: transactionError
  } = useQuery(TRANSACTION_QUERY, {
    variables: { accountId: useParams().id }
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h3">
        {account.accountName} at {account.institution.institutionName}
      </Typography>
      <Typography variant="h6">{account.description}</Typography>
      <Box component="h3" sx={{ marginTop: 5 }}>
        Transactions
      </Box>
      <TransactionsTable transactions={transactions} account={account} />

      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-transaction"
        aria-describedby="add a new transaction to current account"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(10, 10, 10, 0.5)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            backgroundColor: 'white',
            padding: 5,
            borderRadius: 10
          }}
        >
          <Typography variant="h3" sx={{ my: '5px' }}>
            Add new transaction
          </Typography>
          <TextField
            id="outlined-basic"
            label="Character Name"
            variant="outlined"
            value={newTransaction}
            onChange={(e) => setNewTransaction(e.target.value)}
            sx={{ my: '5px' }}
          />
          <Button variant="outlined" onClick={handleClose} sx={{ my: '5px' }}>
            Create
          </Button>
        </Box>
      </Modal> */}
    </Box>
  );
}
