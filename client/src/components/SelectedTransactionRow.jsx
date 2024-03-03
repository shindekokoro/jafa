import { useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import {
  Checkbox,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TableCell,
  TextField,
  tableCellClasses
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SaveIcon from '@mui/icons-material/Save';
import { convertDate } from '../utils';

// ADD_TRANSACTION not completed
import {
  ADD_TRANSACTION,
  ADD_PAYEE,
  ADD_CATEGORY_NAME,
  ADD_CATEGORY_TYPE
} from '../utils/mutations';
import { PAYEE_QUERY, CATEGORY_QUERY, CATEGORY_TYPE_QUERY } from '../utils/queries';

const filter = createFilterOptions();

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
export default function SelectedTransactionRow({
  editTransaction,
  setEditTransaction,
  setTransactions,
  updateTransaction,
  setAddTransaction
}) {
  const [cleared, setCleared] = useState(editTransaction.cleared);
  const [saveTransaction] = useMutation(ADD_TRANSACTION);
  const [addPayee] = useMutation(ADD_PAYEE);
  const [addCategory] = useMutation(ADD_CATEGORY_NAME);
  const [addCategoryType] = useMutation(ADD_CATEGORY_TYPE);

  const saveTransactionInput = useRef({
    account: editTransaction.account?._id,
    purchaseDate: Date.now().toString()
  });
  const inputRef = {
    payee: useRef(null),
    amount: useRef(null),
    category: useRef(null),
    categoryType: useRef(null)
  };

  let { data: payeeData } = useQuery(PAYEE_QUERY);
  let { data: categoryData } = useQuery(CATEGORY_QUERY);
  let { data: categoryTypeData } = useQuery(CATEGORY_TYPE_QUERY);

  let payees = payeeData?.payees || [];
  let categories = categoryData?.categories || [];
  let categoryTypes = categoryTypeData?.categoryTypes || [];

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

  // Handle <input> field changes when user is typing
  const handleInputChange = (event) => {
    event.preventDefault(event);
    const { name, value, selectionEnd } = event.target;
    const rightCharsCount = value?.length - selectionEnd;
    const newPosition = value?.length - rightCharsCount;

    inputRef.current = event.target;
    let input = { [name]: value };

    setEditTransaction({ ...editTransaction, ...input });
    setTimeout(() => {
      inputRef[name]?.current.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const newChange = async (event, newValue) => {
    let updateTransactionInput = {
      transaction: editTransaction._id,
      account: editTransaction.account._id
    };
    let updatedTransaction;
    let newEntry;
    // Handle adding and updating transaction data with new entries/data.
    if (newValue?.newEntry) {
      try {
        switch (newValue.type) {
        case 'payee':
          console.log('Adding Payee');
          newEntry = await addPayee({ variables: { name: newValue.inputValue } });
          updateTransactionInput.payee = editTransaction._id
            ? newEntry.data.addPayee._id
            : (saveTransactionInput.current = {
              ...saveTransactionInput.current,
              payee: newEntry.data.addPayee._id
            });
          break;
        case 'category': {
          console.log('Adding Category');
          newEntry = await addCategory({
            variables: {
              categoryNameInput: {
                categoryName: newValue.inputValue,
                transactions: [editTransaction._id]
              }
            }
          });
          updateTransactionInput.category = editTransaction._id
            ? newEntry.data.addCategoryName.category._id
            : (saveTransactionInput.current = {
              ...saveTransactionInput.current,
              category: newEntry.data.addCategoryName.category._id
            });
          break;
        }
        case 'categoryType': {
          console.log('Adding Category Type');
          newEntry = await addCategoryType({
            variables: {
              categoryTypeInput: {
                categoryTypeName: newValue.inputValue,
                transactions: [editTransaction._id]
              }
            }
          });
          updateTransactionInput.categoryType = editTransaction._id
            ? newEntry.data.addCategoryType.categoryType._id
            : (saveTransactionInput.current = {
              ...saveTransactionInput.current,
              categoryType: newEntry.data.addCategoryType.addCategoryType._id
            });
          break;
        }
        default:
          console.log('No case for this event, nothing changed.', newValue);
        }
      } catch (error) {
        return console.log(error);
      }
      console.log(newEntry);
    }
    // Handle updating the transaction with data already in the database
    else if (newValue?.__typename) {
      switch (newValue?.__typename) {
      case 'Payee':
        console.log('Updating Payee');
        editTransaction._id
          ? (updateTransactionInput.payee = newValue._id)
          : (saveTransactionInput.current = {
            ...saveTransactionInput.current,
            payee: newValue._id
          });
        break;
      case 'CategoryName':
        console.log('Updating Category');
        editTransaction._id
          ? (updateTransactionInput.category = newValue._id)
          : (saveTransactionInput.current = {
            ...saveTransactionInput.current,
            category: newValue._id
          });
        break;
      case 'CategoryType':
        console.log('Updating Category Type');
        editTransaction._id
          ? (updateTransactionInput.categoryType = newValue._id)
          : (saveTransactionInput.current = {
            ...saveTransactionInput.current,
            categoryType: newValue._id
          });
        break;
      default:
        return console.log('Nothing updated', newValue);
      }
    }
    // Handle updating manually entered data for transaction. (Not dependent on database data.)
    else {
      console.log(event);
      if (event.target?.name === 'cleared') {
        setCleared(!cleared);
        editTransaction._id
          ? (updateTransactionInput.cleared = cleared)
          : (saveTransactionInput.current = {
            ...saveTransactionInput.current,
            cleared: cleared
          });
      } else if (event.currentTarget?.value) {
        editTransaction._id
          ? (updateTransactionInput.amount = parseFloat(event.currentTarget.value))
          : (saveTransactionInput.current = {
            ...saveTransactionInput.current,
            amount: parseFloat(event.currentTarget.value)
          });
      } else if (event.$d) {
        let newDate = new Date(event.$d);
        editTransaction._id
          ? (updateTransactionInput.purchaseDate = newDate)
          : (saveTransactionInput.current = {
            ...saveTransactionInput.current,
            purchaseDate: newDate
          });
      } else {
        return console.log('No case for this event, nothing changed.', event, newValue);
      }
    }

    try {
      // Save transaction in the DB and set the updated transactions in state.
      if (!editTransaction._id && event.currentTarget?.value) {
        updatedTransaction = await saveTransaction({
          variables: { addTransactionInput: saveTransactionInput.current }
        });
        await setTransactions(updatedTransaction.data.addTransaction.transactions);
        setAddTransaction(false);
      }
      // Update transaction in the DB and set the updated transactions in state.
      else if (editTransaction._id) {
        console.log('Updating Transaction', editTransaction._id, updateTransactionInput);
        updatedTransaction = await updateTransaction({
          variables: { updateTransactionInput }
        });
        await setEditTransaction(editTransaction);
        await setTransactions(updatedTransaction.data.updateTransaction.transactions);
      }
    } catch (error) {
      console.log(JSON.stringify(saveTransactionInput.current));
      console.log(error);
    }
  };

  return (
    <>
      <StyledTableCell>
        <Checkbox
          aria-label="transaction-status"
          checked={cleared}
          onClick={newChange}
          name="cleared"
          sx={{
            color: 'error.light',
            '&.Mui-checked': {
              color: 'success.main'
            }
          }}
        />
      </StyledTableCell>
      <StyledTableCell>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            value={dayjs(convertDate(editTransaction.purchaseDate))}
            name="purchaseDate"
            slotProps={{ textField: { size: 'small' } }}
            onAccept={newChange}
          />
        </LocalizationProvider>
      </StyledTableCell>
      <StyledTableCell>
        <FormControl size="small">
          <Autocomplete
            id="payee-autocomplete"
            options={payees}
            style={{ width: '25ch' }}
            name="payee"
            // onChange={handleAutoCompleteChange}
            freeSolo
            value={editTransaction.payee.payeeName}
            onChange={newChange}
            filterOptions={(options, params) =>
              handleFilterOptions(options, params, 'payee')
            }
            getOptionLabel={(option) => {
              return option?.payeeName || option?.inputValue || option?.title || option;
            }}
            renderOption={(props, option) => (
              <li {...props} key={option?._id || option}>
                {option?.payeeName || option?.title || option}
              </li>
            )}
            size="small"
            renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>
      </StyledTableCell>
      <StyledTableCell>
        <FormControl variant="filled" size="small">
          <Autocomplete
            id="category-autocomplete"
            options={categories}
            style={{ width: '23ch' }}
            name="category"
            // onChange={handleAutoCompleteChange}
            freeSolo
            value={editTransaction.category.categoryName}
            onChange={newChange}
            filterOptions={(options, params) =>
              handleFilterOptions(options, params, 'category')
            }
            groupBy={(option) => option.categoryType?.categoryTypeName || null}
            getOptionLabel={(option) => {
              return (
                option?.categoryName || option?.inputValue || option?.title || option
              );
            }}
            renderOption={(props, option) => (
              <li {...props} key={option?._id || option}>
                {option?.categoryName || option?.title || option}
              </li>
            )}
            size="small"
            renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>
      </StyledTableCell>
      {/* <StyledTableCell>
        {editTransaction.categoryType.categoryTypeName}
      </StyledTableCell> */}
      <StyledTableCell>
        <FormControl variant="filled" size="small">
          <Autocomplete
            id="category-type-autocomplete"
            options={categoryTypes}
            name="categoryType"
            style={{ width: '15ch' }}
            // onChange={handleAutoCompleteChange}
            freeSolo
            value={editTransaction.categoryType.categoryTypeName}
            onChange={newChange}
            filterOptions={(options, params) =>
              handleFilterOptions(options, params, 'categoryType')
            }
            getOptionLabel={(option) => {
              return (
                option?.categoryTypeName || option?.inputValue || option?.title || option
              );
            }}
            renderOption={(props, option) => (
              <li {...props} key={option?._id || option}>
                {option?.categoryTypeName || option?.title || option}
              </li>
            )}
            size="small"
            renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>
      </StyledTableCell>
      <StyledTableCell sx={{ textAlign: 'right', display: 'float' }}>
        <FormControl variant="filled" size="small">
          <OutlinedInput
            id="amount-input"
            name="amount"
            error={isNaN(editTransaction.amount)}
            value={editTransaction.amount.toString()}
            onChange={handleInputChange}
            inputRef={inputRef.amount}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={newChange}
                  value={editTransaction.amount}
                  name="save"
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
