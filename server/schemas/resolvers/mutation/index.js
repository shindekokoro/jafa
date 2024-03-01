const { addUser, login } = require('./user');
const { addInstitution, removeInstitution } = require('./institution');
const {
  addCategoryType,
  removeCategoryType,
  addCategoryName,
  removeCategoryName
} = require('./category');
const { addPayee, removePayee } = require('./payee');
const { addAccount, removeAccount } = require('./account');
const { addTransaction, updateTransaction, removeTransaction } = require('./transaction');

const Mutation = {
  addUser,
  login,
  addInstitution,
  removeInstitution,
  addCategoryType,
  removeCategoryType,
  addCategoryName,
  removeCategoryName,
  addPayee,
  removePayee,
  addAccount,
  removeAccount,
  addTransaction,
  updateTransaction,
  removeTransaction
};

module.exports = Mutation;
