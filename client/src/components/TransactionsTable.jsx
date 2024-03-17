import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { convertDate, formatAmount } from '../utils';
import { REMOVE_TRANSACTION, UPDATE_TRANSACTION } from '../utils/mutations';
import SelectedTransactionRow from './SelectedTransactionRow';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

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

export default function TransactionTable({ transactions, account }) {
  const emptyTransaction = {
    _id: '',
    purchaseDate: Date.now(),
    payee: { payeeName: '' },
    category: { categoryName: '' },
    categoryType: { categoryTypeName: '' },
    amount: '',
    cleared: false,
    account: { _id: account._id }
  };
  const [loadedTransactions, setTransactions] = useState(transactions);
  const [selectedTransaction, setSelectedTransaction] = useState(0);
  const [deleteIndex, setDeleteIndex] = useState(0);
  const [editTransaction, setEditTransaction] = useState(emptyTransaction);
  const [addTransaction, setAddTransaction] = useState(false);

  const [open, setOpen] = useState(false);
  const openModel = () => {
    setSelectedTransaction(0);
    setOpen(true);
  };
  const closeModel = () => setOpen(false);

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION);
  const [removeTransaction] = useMutation(REMOVE_TRANSACTION);

  const handleAddButton = () => {
    setAddTransaction(!addTransaction);
    setEditTransaction(emptyTransaction);
    setSelectedTransaction(0);
  };

  const handleSelectedTransaction = (event, transaction) => {
    event.preventDefault(event);

    // Don't select transaction:
    // If modal is open OR
    // selected transaction is currently selected.
    const tableCellEvent = event.target.toString().includes('TableCellElement');
    if (open || (selectedTransaction === transaction._id && tableCellEvent)) {
      return setSelectedTransaction(0);
    }

    setSelectedTransaction(transaction._id);
    setAddTransaction(false);
    setEditTransaction(transaction);
  };

  const handleDeleteTransaction = async (event, transaction) => {
    // event.preventDefault(event);
    event.stopPropagation();
    closeModel();
    console.log(
      'Attempting to delete transaction',
      transaction.payee.payeeName,
      transaction._id
    );
    let removedTransactionInput = {
      account: account._id,
      transaction: transaction._id
    };
    let {
      data: { removeTransaction: removedTransaction }
    } = await removeTransaction({
      variables: {
        removeTransactionInput: removedTransactionInput
      }
    });
    if (removedTransaction?.success) {
      console.log('Transaction removed');
    } else {
      console.error('Transaction not removed');
    }
    setTransactions(removedTransaction.transactions);
    setEditTransaction(emptyTransaction);
    setDeleteIndex(0);
  };

  const clearedTransactionEvent = async (event, index) => {
    event.stopPropagation();

    let updateTransactionInput = {
      transaction: loadedTransactions[index]._id,
      account: loadedTransactions[index].account._id,
      cleared: !loadedTransactions[index].cleared
    };
    // let checkboxTransactions = loadedTransactions.map((transaction, i) =>
    //   i === index ? { ...transaction, cleared: !transaction.cleared } : transaction
    // );
    let { data } = await updateTransaction({
      variables: { updateTransactionInput }
    });
    console.log('updatedTransactions', data.updateTransaction);
    setTransactions(data.updateTransaction.transactions);
  };

  const DeleteModal = () => {
    let transaction = loadedTransactions[deleteIndex];
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
              Are you sure you want to delete this transaction?
            </Typography>
            <Typography id="spring-modal-description" variant="body1">
              {convertDate(transaction.purchaseDate)}{' '}
              <strong>{transaction.payee.payeeName}</strong>
            </Typography>
            <Typography variant="body1">
              {transaction.category.categoryName}{' in '}
              <em>{transaction.categoryType.categoryTypeName}</em>{' '}
              <strong>{formatAmount(transaction.amount, account.currency)}</strong>
            </Typography>
            <Button onClick={(event) => handleDeleteTransaction(event, transaction)}>
              Yes
            </Button>
            <Button onClick={closeModel}>No</Button>
          </Box>
        </Fade>
      </Modal>
    );
  };

  const TransactionRow = ({ transaction, account, index }) => {
    return (
      <>
        <StyledTableCell>
          <Checkbox
            aria-label="transaction-status"
            checked={transaction.cleared}
            onClick={(event) => clearedTransactionEvent(event, index)}
            sx={{
              color: 'error.light',
              '&.Mui-checked': {
                color: 'success.main'
              }
            }}
          />
        </StyledTableCell>
        <StyledTableCell>{convertDate(transaction.purchaseDate)}</StyledTableCell>
        <StyledTableCell>{transaction.payee.payeeName}</StyledTableCell>
        <StyledTableCell>{transaction.category.categoryName}</StyledTableCell>
        <StyledTableCell>{transaction.categoryType.categoryTypeName}</StyledTableCell>
        <StyledTableCell sx={{ textAlign: 'right' }}>
          {formatAmount(transaction.amount, account.currency)}{' '}
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              setDeleteIndex(index);
              openModel();
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
    <TableContainer sx={{ marginBottom: 5 }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell width={'10px'}>Cleared</StyledTableCell>
            <StyledTableCell width={'100px'}>Date</StyledTableCell>
            <StyledTableCell width={'260px'}>Payee</StyledTableCell>
            <StyledTableCell width={'160px'}>Category</StyledTableCell>
            <StyledTableCell width={'160px'}>Type</StyledTableCell>
            <StyledTableCell width={'100px'} sx={{ textAlign: 'right' }}>
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
              <SelectedTransactionRow
                editTransaction={editTransaction}
                setEditTransaction={setEditTransaction}
                setTransactions={setTransactions}
                updateTransaction={updateTransaction}
                setAddTransaction={setAddTransaction}
              />
            </StyledTableRow>
          ) : (
            <></>
          )}
          {loadedTransactions?.length === 0 || loadedTransactions === null ? (
            <StyledTableRow key={0}>
              <TableCell colSpan={6}>
                {loadedTransactions === null
                  ? 'No transactions, are you logged in?'
                  : 'No transactions'}
              </TableCell>
            </StyledTableRow>
          ) : (
            loadedTransactions.map((transaction, index) => (
              <StyledTableRow
                key={transaction._id}
                name={transaction._id}
                onClick={(event) => handleSelectedTransaction(event, transaction)}
              >
                {selectedTransaction === transaction._id ? (
                  <SelectedTransactionRow
                    editTransaction={editTransaction}
                    setEditTransaction={setEditTransaction}
                    setTransactions={setTransactions}
                    updateTransaction={updateTransaction}
                  />
                ) : (
                  <TransactionRow
                    transaction={transaction}
                    account={account}
                    index={index}
                  />
                )}
                <DeleteModal />
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
