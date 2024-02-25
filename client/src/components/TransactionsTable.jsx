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
import { REMOVE_TRANSACTION } from '../utils/mutations';
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
  const [editTransaction, setEditTransaction] = useState(emptyTransaction);
  const [addTransaction, setAddTransaction] = useState(false);

  const [open, setOpen] = useState(false);
  const openModel = () => setOpen(true);
  const closeModel = () => setOpen(false);

  const [removeTransaction, { error: removeError }] = useMutation(REMOVE_TRANSACTION);

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

  const handleDeleteTransaction = async (event, transaction) => {
    event.preventDefault(event);
    setSelectedTransaction(0);
    closeModel();

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

  const TransactionRow = ({ transaction, account }) => {
    return (
      <>
        <StyledTableCell>
          <Checkbox aria-label="transaction-status" checked={transaction.cleared} />
        </StyledTableCell>
        <StyledTableCell>{convertDate(transaction.purchaseDate)}</StyledTableCell>
        <StyledTableCell>{transaction.payee.payeeName}</StyledTableCell>
        <StyledTableCell>{transaction.category.categoryName}</StyledTableCell>
        <StyledTableCell>
          {transaction.category.categoryType.categoryTypeName}
        </StyledTableCell>
        <StyledTableCell sx={{ textAlign: 'right' }}>
          {formatAmount(transaction.amount, account.currency)}{' '}
          <IconButton
            onClick={openModel}
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
                <Button
                  onClick={(event) => {
                    handleDeleteTransaction(event, transaction);
                  }}
                >
                  Yes
                </Button>
                <Button onClick={closeModel}>No</Button>
              </Box>
            </Fade>
          </Modal>
        </StyledTableCell>
      </>
    );
  };

  return (
    <TableContainer sx={{ marginBottom: 5 }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell width={'4ch'}>Cleared</StyledTableCell>
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
              <SelectedTransactionRow
                editTransaction={editTransaction}
                setEditTransaction={setEditTransaction}
              />
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
                onContextMenu={(event) => handleSelectedTransaction(event, transaction)}
                onTouchStart={handleSelectedTransaction}
              >
                {selectedTransaction === transaction._id ? (
                  <SelectedTransactionRow
                    editTransaction={editTransaction}
                    setEditTransaction={setEditTransaction}
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
