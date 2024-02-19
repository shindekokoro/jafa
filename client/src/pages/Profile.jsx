import { Link, Navigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { ME_QUERY } from '../utils/queries';

import Auth from '../utils/auth';
import { Box, Typography } from '@mui/material';

export default function Profile() {
  const { loading, data, error } = useQuery(ME_QUERY);
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
  let { user } = data;
  // navigate to login if not logged in
  if (!Auth?.loggedIn() || !user?.username) {
    return (
      <Typography variant="h3">
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in! <Link to="/login">Login</Link>
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5">Accounts</Typography>
      {user.accounts.length ? (
        user.accounts.map((account) => (
          <Box key={account._id}>
            <Typography variant="h6">
              <Link to={`/account/${account._id}`}>{account.accountName}</Link> at {account.institution.institutionName}
            </Typography>
            <Typography variant="body1">{account.description}</Typography>
          </Box>
        ))
      ) : (
        <Typography variant="h6">You have no accounts</Typography>
      )}
    </Box>
  );
}
