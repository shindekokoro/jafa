import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import { ME_QUERY, INSTITUTIONS_QUERY } from '../utils/queries';
import { ADD_INSTITUTION, ADD_ACCOUNT } from '../utils/mutations';

import Auth from '../utils/auth';
import { Account } from '../components';
import {
  Alert,
  AlertTitle,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Fade,
  FormControl,
  Modal,
  TextField,
  Typography
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const filter = createFilterOptions();
const accountTypes = [
  'Checking',
  'Savings',
  'Credit Card',
  'Investment',
  'Loan',
  'Other'
];
const currencies = ['USD', 'CAD', 'EUR', 'GBP', 'JPY', 'AUD', 'CHF', 'CNY', 'SEK', 'NZD'];

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
  '& .MuiButtonBase-root': { m: 1 }
};

export default function Profile() {
  const emptyAccount = {
    accountName: '',
    institution: '',
    institutionName: '',
    type: 'Checking',
    currency: 'USD',
    description: '',
    startingBalance: 0.0
  };
  const [account, setAccount] = useState(emptyAccount);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({});
  const openModel = () => setOpen(true);
  const closeModel = () => {
    setAccount(emptyAccount);
    setOpen(false);
  };

  const [addInstitution] = useMutation(ADD_INSTITUTION);
  const [addAccount] = useMutation(ADD_ACCOUNT);
  const { loading: userLoading, data: userData, error: userError } = useQuery(ME_QUERY);
  const { data: institutionData } = useQuery(INSTITUTIONS_QUERY);
  const [institutions, setInstitutions] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);

  if (institutionData && !institutions.length) {
    setInstitutions(institutionData.institutions);
  }

  useEffect(() => {
    userLoading ? null : setUserAccounts(userData.user.accounts);
  }, [userData, userLoading]);

  useEffect(() => {
    setTimeout(() => {
      setAlert({});
    }, 10000);
    
  }, [alert]);

  if (userLoading) {
    console.log('No user data, still loading');
    return <CircularProgress />;
  }
  if (userError) {
    if (userError.message === 'You are not authenticated.') {
      return <Navigate to="/logout" />;
    }
    console.log(userError);
    throw userError;
  }
  let { user } = userData;
  // navigate to login if not logged in
  if (!Auth?.loggedIn() || !user?.username) {
    return <Navigate to="/login" />;
  }

  const handleFilterOptions = (options, params, name) => {
    const filtered = filter(options, params);
    const { inputValue } = params;
    // Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue === option.title);
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        inputValue,
        title: `Add "${inputValue}"`,
        newEntry: true,
        type: name
      });
    }
    return filtered;
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    const { id, value } = event.target;
    setAccount({
      ...account,
      [id]: value
    });
    console.log(account);
  };

  const handleAutocompleteChange = async (event, newValue) => {
    const { id } = event.target;
    const key = id.split('-')[0];
    if (!key) {
      return console.error('No key found');
    }
    if (newValue?.newEntry) {
      console.log('New entry');
      console.log(newValue);

      if (newValue.type === 'institution') {
        let institutionInput = {
          institutionName: newValue.inputValue
        };

        try {
          const newInstitution = await addInstitution({
            variables: {
              institutionInput: institutionInput
            }
          });
          setAccount({
            ...account,
            institution: newInstitution.data.addInstitution.institution._id,
            institutionName:
              newInstitution.data.addInstitution.institution.institutionName
          });
          setInstitutions([
            ...institutions,
            newInstitution.data.addInstitution.institutions
          ]);
          return newInstitution;
        } catch (error) {
          console.error('Error adding institution', error);
          return undefined;
        }
      } else {
        return;
      }
    }
    let input = newValue;
    let institution = key === 'institutionName' ? newValue?._id : account.institution;
    if (typeof newValue === 'object') {
      input = newValue[key];
    }
    setAccount({
      ...account,
      institution,
      [key]: input
    });
  };

  const handleAddAccount = async () => {
    try {
      let addedAccountInput = { ...account };
      delete addedAccountInput.institutionName;
      addedAccountInput.startingBalance = parseFloat(addedAccountInput.startingBalance);
      let addedAccount = await addAccount({
        variables: {
          addAccountInput: addedAccountInput
        }
      });
      if (addedAccount.data.addAccount.account._id) {
        setUserAccounts(addedAccount.data.addAccount.accounts);
        closeModel();
        return setAlert({
          open: true,
          message: 'Account added',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error adding account', error);
      return setAlert({
        open: true,
        message: 'Error adding account',
        severity: 'error'
      });
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" sx={{ pb: 1 }}>
          Accounts
          <Button
            size="small"
            sx={{ ml: 2 }}
            startIcon={<AddCircleIcon />}
            variant="outlined"
            onClick={openModel}
          >
            Account
          </Button>
        </Typography>
        <Box>
          <Collapse in={alert.open} unmountOnExit>
            <Alert
              severity={alert.severity}
              onClose={() => {
                setAlert({});
              }}
            >
              <AlertTitle>
                {alert.severity?.charAt(0).toUpperCase() + alert.severity?.slice(1)}
              </AlertTitle>
              {alert.message}
            </Alert>
          </Collapse>
        </Box>
        <Box
          sx={{
            mt: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 30%), 1fr))',
            gap: 2
          }}
        >
          {userAccounts.length ? (
            userAccounts.map((account) => (
              <Account
                key={account._id}
                account={account}
                setUserAccounts={setUserAccounts}
                setAlert={setAlert}
              />
            ))
          ) : (
            <Typography variant="h6">You have no accounts, try adding one.</Typography>
          )}
        </Box>
      </Box>

      <Modal
        aria-labelledby="add-account-modal"
        aria-describedby="add-account-form"
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
              Add an account to start tracking your transactions.
            </Typography>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' }
              }}
            >
              <TextField
                size="small"
                id="accountName"
                label="Account Name"
                error={account.accountName === ''}
                value={account.accountName}
                onChange={handleInputChange}
              />
              <TextField
                size="small"
                id="description"
                label="Description"
                value={account.description}
                onChange={handleInputChange}
              />
              <FormControl size="small">
                <Autocomplete
                  freeSolo
                  size="small"
                  id="institutionName"
                  onChange={handleAutocompleteChange}
                  options={institutions}
                  filterOptions={(options, params) =>
                    handleFilterOptions(options, params, 'institution')
                  }
                  getOptionLabel={(option) => {
                    return (
                      option?.institutionName ||
                      option?.inputValue ||
                      option?.title ||
                      option
                    );
                  }}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option._id || option}>
                        {option?.institutionName || option?.title || option}
                      </li>
                    );
                  }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        error={account.institution === ''}
                        label="Institution Name"
                      />
                    );
                  }}
                />
              </FormControl>
              <FormControl>
                <Autocomplete
                  size="small"
                  id="type"
                  onChange={handleAutocompleteChange}
                  value={account.type}
                  options={accountTypes}
                  renderInput={(params) => <TextField {...params} label="Account Type" />}
                />
              </FormControl>
              <Autocomplete
                size="small"
                id="currency"
                onChange={handleAutocompleteChange}
                value={account.currency}
                options={currencies}
                renderInput={(params) => <TextField {...params} label="Currency" />}
              />
              <TextField
                size="small"
                id="startingBalance"
                label="Starting Balance"
                error={isNaN(account.startingBalance) || account.startingBalance === ''}
                value={account.startingBalance}
                onChange={handleInputChange}
              />
            </Box>
            <Button size="small" onClick={handleAddAccount} variant="outlined">
              Add
            </Button>
            <Button size="small" onClick={closeModel} variant="outlined">
              Cancel
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
