import { useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import {
  Checkbox,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { convertDate, formatAmount } from '../utils';
import { ADD_TRANSACTION, REMOVE_TRANSACTION } from '../utils/mutations';

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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const emptyTransaction = {
  purchaseDate: Date.now(),
  payee: { payeeName: '' },
  category: { categoryName: '', categoryType: { categoryTypeName: '' } },
  amount: '',
  cleared: false
};

export default function TransactionTable({ transactions, account }) {
  const [loadedTransactions, setTransactions] = useState(transactions);
  const [selectedTransaction, setSelectedTransaction] = useState(0);
  const [addTransaction, setAddTransaction] = useState(false);
  const [editTransaction, setEditTransaction] = useState(emptyTransaction);

  const [saveTransaction, { error: saveError }] = useMutation(ADD_TRANSACTION);
  const [removeTransaction, { error: removeError }] =
    useMutation(REMOVE_TRANSACTION);

  const inputRef = {
    payee: useRef(null),
    amount: useRef(null),
    category: useRef(null),
    categoryType: useRef(null)
  };

  const handleAddButton = () => {
    setAddTransaction(!addTransaction);
    setEditTransaction(emptyTransaction);
    setSelectedTransaction(0);
  };

  const handleSelectedTransaction = (event, transaction) => {
    event.preventDefault(event);
    setSelectedTransaction(transaction._id);
    setAddTransaction(false);
    setEditTransaction(transaction);
  };

  const handleChange = (event) => {
    event.preventDefault(event);
    const { name, value, selectionEnd } = event.target;

    const rightCharsCount = value.length - selectionEnd;
    const newPosition = value.length - rightCharsCount;
    console.log(event.target);
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

  const handleDeleteTransaction = async (event, transaction) => {
    event.preventDefault(event);
    setSelectedTransaction(0);

    console.log(account._id);
    console.log(transaction._id);
    let {
      data: { removeTransaction: removedTransaction }
    } = await removeTransaction({
      variables: {
        accountId: account._id,
        transactionId: transaction._id
      }
    });
    if (removedTransaction?.success) {
      console.log('Transaction removed');
    } else {
      console.error('Transaction not removed');
    }
    console.log(loadedTransactions, removedTransaction);
    await setTransactions(removedTransaction.transaction);
  };

  const SelectedTransactionRow = ({ transaction }) => {
    return (
      <>
        <StyledTableCell>
          <Checkbox
            aria-label="transaction-status"
            checked={transaction.cleared}
          />
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
            <OutlinedInput
              placeholder={transaction.payee.payeeName}
              id="payee-input"
              type="text"
              name="payee"
              value={transaction.payee.payeeName}
              onChange={handleChange}
              inputRef={inputRef.payee}
            />
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
              type="text"
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
  };

  const TransactionRow = ({ transaction, account }) => {
    return (
      <>
        <StyledTableCell>
          <Checkbox
            aria-label="transaction-status"
            checked={transaction.cleared}
          />
        </StyledTableCell>
        <StyledTableCell>
          {convertDate(transaction.purchaseDate)}
        </StyledTableCell>
        <StyledTableCell>{transaction.payee.payeeName}</StyledTableCell>
        <StyledTableCell>{transaction.category.categoryName}</StyledTableCell>
        <StyledTableCell>
          {transaction.category.categoryType.categoryTypeName}
        </StyledTableCell>
        <StyledTableCell sx={{ textAlign: 'right' }}>
          {formatAmount(transaction.amount, account.currency)}{' '}
          <IconButton
            onClick={(event) => {
              handleDeleteTransaction(event, transaction);
            }}
            sx={{
              '&:hover': {
                color: 'error.light'
              },
              '&:active': {
                color: 'error.main'
              }
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
        </StyledTableCell>
      </>
    );
  };

  return (
    <TableContainer sx={{ maxWidth: '75%', marginBottom: 5 }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell width={'5ch'}>Cleared</StyledTableCell>
            <StyledTableCell width={'16ch'}>Date</StyledTableCell>
            <StyledTableCell width={'20ch'}>Payee</StyledTableCell>
            <StyledTableCell width={'17ch'}>Category</StyledTableCell>
            <StyledTableCell width={'8ch'}>Type</StyledTableCell>
            <StyledTableCell width={'18ch'} sx={{ textAlign: 'right' }}>
              Amount
              <IconButton
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'success.light'
                  },
                  '&:active': {
                    color: 'success.main'
                  }
                }}
                onClick={handleAddButton}
              >
                <AddCircleIcon />
              </IconButton>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addTransaction ? (
            <StyledTableRow>
              <SelectedTransactionRow transaction={editTransaction} />
            </StyledTableRow>
          ) : (
            <></>
          )}
          {loadedTransactions.length === 0 ? (
            <StyledTableRow key={0}>
              <TableCell>No transactions</TableCell>
            </StyledTableRow>
          ) : (
            loadedTransactions.map((transaction) => (
              <StyledTableRow
                key={transaction._id}
                name={transaction._id}
                onContextMenu={(event) =>
                  handleSelectedTransaction(event, transaction)
                }
                onTouchStart={handleSelectedTransaction}
              >
                {selectedTransaction === transaction._id ? (
                  <SelectedTransactionRow
                    transaction={editTransaction}
                    account={account}
                  />
                ) : (
                  <TransactionRow transaction={transaction} account={account} />
                )}
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
