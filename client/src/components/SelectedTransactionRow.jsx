import { useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import {
  Autocomplete,
  Checkbox,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TableCell,
  TextField,
  Typography,
  tableCellClasses
} from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SaveIcon from '@mui/icons-material/Save';
import { convertDate } from '../utils';

import { ADD_TRANSACTION } from '../utils/mutations';
import { PAYEE_QUERY, CATEGORY_QUERY } from '../utils/queries';

const StyledTableCell = styled(TableCell)(({ theme, width }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.secondary.light,
    width: width
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

// Returns a selected transaction row with editable fields
export default function SelectedTransactionRow({ editTransaction, setEditTransaction }) {
  const [saveTransaction, { error: saveError }] = useMutation(ADD_TRANSACTION);
  const {
    loading: payeesLoading,
    data: payeeData,
    error: payeesError
  } = useQuery(PAYEE_QUERY);
  const {
    loading: categoryLoading,
    data: categoryData,
    error: categoryError
  } = useQuery(CATEGORY_QUERY);
  const payees = payeeData?.payees || [];
  const inputRef = {
    payee: useRef(null),
    amount: useRef(null),
    category: useRef(null),
    categoryType: useRef(null)
  };
  let transaction = editTransaction;

  if (payeesLoading) {
    return (
      <StyledTableCell>
        <Typography>Loading...</Typography>
      </StyledTableCell>
    );
  }
  if (payeesError) {
    console.error(payeesError);
  }

  const handleChange = (event) => {
    event.preventDefault(event);
    const { name, value, selectionEnd } = event.target;
    const rightCharsCount = value.length - selectionEnd;
    const newPosition = value.length - rightCharsCount;

    inputRef.current = event.target;
    let input;
    switch (name) {
    case 'payee':
      input = { ...editTransaction, payee: { payeeName: value } };
      break;
    case 'category':
      input = {
        category: { ...editTransaction.category, categoryName: value }
      };
      break;
    case 'categoryType':
      input = {
        category: {
          ...editTransaction.category,
          categoryType: { categoryTypeName: value }
        }
      };
      break;
    default:
      input = { [name]: value };
    }

    setEditTransaction({ ...editTransaction, ...input });
    setTimeout(() => {
      inputRef[name].current.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleSaveTransaction = () => {
    console.log('Saving transaction');

    let savedTransaction = saveTransaction({
      variables: {
        transaction: {
          _id: editTransaction._id,
          purchaseDate: editTransaction.purchaseDate,
          payee: editTransaction.payee.payeeName,
          category: editTransaction.category.categoryName,
          categoryType: editTransaction.category.categoryType.categoryTypeName,
          amount: editTransaction.amount,
          cleared: editTransaction.cleared
        }
      }
    });
    saveError ? console.error(saveError) : console.log('Transaction saved');
    return savedTransaction;
  };
  console.log(editTransaction);
  return (
    <>
      <StyledTableCell>
        <Checkbox aria-label="transaction-status" checked={transaction.cleared} />
      </StyledTableCell>
      <StyledTableCell>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            value={dayjs(convertDate(transaction.purchaseDate))}
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider>
      </StyledTableCell>
      <StyledTableCell>
        <FormControl size="small">
          <Autocomplete
            id="payee-autocomplete"
            options={payees}
            getOptionLabel={(option) => option.payeeName}
            style={{ width: '25ch' }}
            loading={payeesLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={transaction.payee.payeeName}
                size="small"
              />
            )}
          />
          {/* <OutlinedInput
            placeholder={transaction.payee.payeeName}
            id="payee-input"
            type="text"
            name="payee"
            value={transaction.payee.payeeName}
            onChange={handleChange}
            inputRef={inputRef.payee}
          /> */}
        </FormControl>
      </StyledTableCell>
      <StyledTableCell>
        <FormControl variant="filled" size="small">
          <OutlinedInput
            placeholder={transaction.category.categoryName}
            id="category-input"
            type="text"
            name="category"
            value={transaction.category.categoryName}
            onChange={handleChange}
            inputRef={inputRef.category}
          />
        </FormControl>
      </StyledTableCell>
      <StyledTableCell>
        <FormControl variant="filled" size="small">
          <OutlinedInput
            placeholder={transaction.category.categoryType.categoryTypeName}
            id="category-type-input"
            type="text"
            name="categoryType"
            value={transaction.category.categoryType.categoryTypeName}
            onChange={handleChange}
            inputRef={inputRef.categoryType}
          />
        </FormControl>
      </StyledTableCell>
      <StyledTableCell sx={{ textAlign: 'right', display: 'float' }}>
        <FormControl variant="filled" size="small">
          <OutlinedInput
            placeholder={transaction.amount}
            id="amount-input"
            name="amount"
            error={isNaN(transaction.amount)}
            value={transaction.amount}
            onChange={handleChange}
            inputRef={inputRef.amount}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSaveTransaction}
                  edge="end"
                  sx={{
                    '&:hover': {
                      color: 'success.light'
                    },
                    '&:active': {
                      color: 'success.main'
                    }
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </StyledTableCell>
    </>
  );
}
