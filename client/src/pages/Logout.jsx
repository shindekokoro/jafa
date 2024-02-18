import { Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Auth from '../utils/auth';

export default function Logout() {
  // check if signed in
  if (!Auth.loggedIn()) {
    return <Navigate to="/" />;
  }

  return (
    <Box>
      <Typography>
        You are logging out...
        {Auth.logout()}
      </Typography>
    </Box>
  );
}
