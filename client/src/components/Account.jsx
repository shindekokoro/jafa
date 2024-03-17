import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Fade,
  IconButton,
  Modal,
  Typography
} from '@mui/material';
import DeleteForever from '@mui/icons-material/DeleteForever';

import { REMOVE_ACCOUNT } from '../utils/mutations';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  button: { mt: 1, mr: 1 }
};

export default function Account({ account, setUserAccounts }) {
  const [open, setOpen] = useState(false);
  const openModel = () => setOpen(true);
  const closeModel = () => setOpen(false);

  const [removeAccount] = useMutation(REMOVE_ACCOUNT);

  const handleDeleteAccount = async (event, account) => {
    // event.preventDefault(event);
    event.stopPropagation();

    console.log('Attempting to delete account', account.accountName);
    let removedAccount;
    try {
      let { data } = await removeAccount({
        variables: {
          account: account._id
        }
      });
      removedAccount = data.removeAccount;
    } catch (error) {
      console.error(error);
    }
    if (removedAccount?.success) {
      console.log('Account removed');
      removedAccount.accounts
        ? setUserAccounts(removedAccount.accounts)
        : console.log('No accounts');
      return closeModel();
    } else {
      return console.error('Account not removed', removedAccount);
    }
  };

  const DeleteModal = () => {
    return (
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={closeModel}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade
          }
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography id="spring-modal-title" variant="h6" component="h2">
              Are you sure you want to delete this account?
            </Typography>
            <Typography id="spring-modal-description" variant="body1">
              {account.accountName} at {account.institution.institutionName}
            </Typography>
            <Button
              variant="outlined"
              onClick={(event) => handleDeleteAccount(event, account)}
            >
              Yes
            </Button>
            <Button variant="outlined" onClick={closeModel}>
              No
            </Button>
          </Box>
        </Fade>
      </Modal>
    );
  };

  return (
    <>
      <Card variant="outlined">
        <CardHeader
          title={account.accountName}
          subheader={account.institution.institutionName}
          action={
            <IconButton aria-label="delete-account" size="small" onClick={openModel}>
              <DeleteForever fontSize="inherit" />
            </IconButton>
          }
        />
        <DeleteModal />
        <CardContent>
          <Typography variant="body2">{account.description || <br />}</Typography>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            size="small"
            variant="outlined"
            component={Link}
            to={`/account/${account._id}`}
          >
            More Info
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
