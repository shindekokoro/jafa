const gql = require('graphql-tag');

const typeDefs = gql`
  "A User consists of a username, email, password, their accounts, and their transactions"
  type User {
    "The unique identifier for the user"
    _id: ID!
    "The username of the user, required and unique"
    username: String!
    "The email of the user, required and unique"
    email: String!
    "The password of the user, required"
    password: String!
    "The accounts of the user"
    accounts: [Account]!
    "The institutions of the user"
    institutions: [Institution]!
    "The transactions of the user"
    transactions: [Transaction]!
  }

  "An Account consists of an account name, description, institution, type, currency, starting balance, calculated balance, and transactions"
  type Account {
    "The unique identifier for the account"
    _id: ID!
    "The name of the account, required and unique"
    accountName: String!
    "The description of the account, optional."
    description: String
    "The institution of the account, required"
    institution: Institution!
    "The type of the account (ie. checking, savings, etc.), required"
    type: String!
    "The currency of the account (ie. USD, CAD, etc.), required"
    currency: String!
    "The starting balance of the account, required"
    startingBalance: Float
    "The calculated balance of the account"
    calculatedBalance: Float
    "The transactions of the account"
    transactions: [Transaction]!
    "The user the account belongs to, required"
    user: User!
  }

  "An Institution consists of a name, other info, accounts, and a user"
  type Institution {
    "The unique identifier for the institution"
    _id: ID!
    "The name of the institution, required and unique"
    institutionName: String!
    "Other information about the institution, optional."
    otherInfo: String
    "The accounts associated with the institution"
    accounts: [Account]!
    "The user the institution belongs to, required"
    user: User!
  }

  "A Transaction consists of an account, purchase date, payee, category, amount, split, related, cleared, and a user"
  type Transaction {
    "The unique identifier for the transaction"
    _id: ID!
    "The account the transaction belongs to, required"
    account: Account!
    "The date of the transaction, required. Format: UNIX timestamp."
    purchaseDate: String
    "The payee of the transaction (ie. Walmart, Amazon, etc.), required."
    payee: Payee
    "The category of the transaction, required"
    category: CategoryName!
    "The amount of the transaction (Float), required"
    amount: Float!
    "Whether the transaction is a split or not, required. Default: false"
    split: Boolean
    "The related transaction, required if split is true"
    related: Transaction!
    "Whether the transaction is cleared or not, required. Default: false"
    cleared: Boolean
    "The user the transaction belongs to, required"
    user: User!
  }

  "A Payee consists of a name and a user. Payees are the people or companies that you pay money to."
  type Payee {
    "The unique identifier for the payee"
    _id: ID!
    "The name of the payee, required and unique"
    payeeName: String!
    "The user the payee belongs to, required"
    user: User!
  }

  "A Category Type consists of a category type name, categories, and a user"
  type CategoryType {
    "The unique identifier for the category type"
    _id: ID!
    "The name of the category type (ie, Utilities, Food, etc.), required and unique"
    categoryTypeName: String!
    "The categories associated with the category type"
    categories: [CategoryName]!
    "The user the category type belongs to, required"
    user: User!
  }

  "A Category consists of a category name, category type, and a user"
  type CategoryName {
    "The unique identifier for the category name"
    _id: ID!
    "The name of the category (ie, Rent, Groceries, etc.), required and unique"
    categoryName: String!
    "The name of the category type (ie, Utilities, Food, etc.), required and unique"
    categoryType: CategoryType
    "The user the category name belongs to, required"
    user: User!
  }

  "Auth consists of a token and a user. The token is used for authentication and the user is the user that is logged in."
  type Auth {
    "The token used for authentication."
    token: ID!
    "The user that is logged in."
    user: User!
  }

  type Query {
    "Return self if logged in."
    user: User
    "Returns all payees for a user. Requires a user to be logged in."
    payees: [Payee]
    "Returns all the category names for a user. Requires a user to be logged in."
    categories: [CategoryName]
    "Returns all the category types for a user. Requires a user to be logged in."
    categoryTypes: [CategoryType]
    "Returns a single account by accountId. Populates the account info as well as the transactions. Requires a user to be logged in."
    account(accountId: ID!): Account
    "Returns all accounts for a user. Requires a user to be logged in."
    accounts: [Account]
    "Returns a transaction by accountId and transactionId. Requires a user to be logged in."
    transaction(accountId: ID!, transactionId: ID!): Transaction
    "Returns all transactions for an account by accountId. Requires a user to be logged in."
    transactions(accountId: ID!): [Transaction]
  }

  type Mutation {
    "Add a new user. Returns a Auth token and the user that was added."
    addUser(username: String!, email: String!, password: String!): Auth
    "Login a user. Returns a Auth token of the user that was logged in."
    login(email: String!, password: String!): Auth

    "Add a new institution. Requires a user to be logged in. Returns the institution that was added."
    addInstitution(name: String!, otherInfo: String!): Institution
    "Update an existing institution. Requires a user to be logged in. Returns the institution that was updated."
    updateInstitution(institutionId: ID!, name: String, otherInfo: String): Institution
    "Remove an existing institution. Requires a user to be logged in. Returns the institution that was removed."
    removeInstitution(institutionId: ID!): Institution

    "Add a new category type. Requires a user to be logged in. Returns the category type that was added."
    addCategoryType(categoryTypeName: String!): CategoryType
    "Update an existing category type. Requires a user to be logged in. Returns the category type that was updated."
    updateCategoryType(categoryTypeId: ID!, categoryTypeName: String!): CategoryType
    "Remove an existing category type. Requires a user to be logged in. Returns the category type that was removed."
    removeCategoryType(categoryTypeId: ID!): CategoryType

    "Add a new category name. Requires a user to be logged in. Returns the category name that was added."
    addCategoryName(categoryName: String!, categoryType: ID!): CategoryName
    "Update an existing category name. Requires a user to be logged in. Returns the category name that was updated."
    updateCategoryName(
      categoryId: ID!
      categoryName: String
      categoryType: ID
    ): CategoryName
    "Remove an existing category name. Requires a user to be logged in. Returns the category name that was removed."
    removeCategoryName(categoryNameId: ID!): CategoryName

    "Add a new payee. Requires a user to be logged in. Returns the payee that was added."
    addPayee(name: String!): Payee
    "Update an existing payee. Requires a user to be logged in. Returns the payee that was updated."
    updatePayee(payeeId: ID!, name: String!): Payee
    "Remove an existing payee. Requires a user to be logged in. Returns the payee that was removed."
    removePayee(payeeId: ID!): Payee

    "Add a new account. Requires a user to be logged in. Returns the account that was added."
    addAccount(
      accountName: String!
      description: String
      institution: ID!
      type: String!
      currency: String!
      startingBalance: Float!
    ): Account
    "Update an existing account. Requires a user to be logged in. Returns the account that was updated."
    updateAccount(
      accountId: ID!
      accountName: String
      description: String
      institution: ID
      type: String
      currency: String
      startingBalance: Float
    ): Account
    "Remove an existing account. Requires a user to be logged in. Returns the account that was removed."
    removeAccount(accountId: ID!): Account

    "Add a new transaction, user to be logged in. Returns transactionResponse type with the status code, success, message, updated list of transactions, and the account that the transaction belongs to."
    addTransaction(addTransactionInput: addTransactionInput): transactionResponse
    "Update an existing transaction. Requires a user to be logged in. Returns the transactionResponse type with the status code, success, message, updated list of transactions, and the account that the transaction belongs to"
    updateTransaction(updateTransactionInput: updateTransactionInput): transactionResponse
    "Remove an existing transaction. Requires a user to be logged in. Returns the transaction that was removed."
    removeTransaction(accountId: ID!, transactionId: ID!): transactionResponse
  }

  "The input for adding a transaction. Requires the accountId, purchaseDate, payee, category, and amount. All other fields are optional."
  input addTransactionInput {
    "The account the transaction belongs to, required"
    accountId: ID!
    "The date of the transaction, required. Format: UNIX timestamp."
    purchaseDate: String!
    "The payee of the transaction (ie. Walmart, Amazon, etc.), required."
    payee: ID!
    "The category of the transaction, required"
    category: ID!
    "The category type of the transaction, required"
    categoryType: ID!
    "The amount of the transaction (Float), required"
    amount: Float!
    "Whether the transaction is a split or not, required. Default: false"
    split: Boolean
    "The related transaction, required if split is true"
    related: ID
    "Whether the transaction is cleared or not, required. Default: false"
    cleared: Boolean
  }

  "The input for updating a transaction. Requires the transactionId and the accountID to confirm which account the transaction belongs to. All other fields are optional."
  input updateTransactionInput {
    "The unique identifier for the transaction"
    transactionId: ID!
    "The account the transaction belongs to, required to confirm ownership."
    account: ID!
    "The date of the transaction. Format: YYYY-MM-DD"
    purchaseDate: String
    "The payee of the transaction (ie. Walmart, Amazon, etc.)."
    payee: ID
    "The category of the transaction."
    category: ID
    "The category type of the transaction."
    categoryType: ID
    "The amount of the transaction (Float)."
    amount: Float
    "Whether the transaction is a split or not. Default: false"
    split: Boolean
    "The related transaction. if split is true"
    related: ID
    "Whether the transaction is cleared or not. Default: false"
    cleared: Boolean
  }

  "The response for adding, updating, or removing a transaction. Returns the status code, success, message, updated list of transactions, and the account that the transaction belongs to."
  type transactionResponse {
    "The status code of the response. 200 is OK, 400 is a bad request, 401 is unauthorized, 404 is not found, 500 is a server error."
    code: Int!
    "The success of the response. True if successful, false if not."
    success: Boolean!
    "The message for the response, describing what happened."
    message: String!
    "The updated list of transactions."
    transactions: [Transaction]
    "The account that the transaction belongs to."
    account: Account
  }
`;

module.exports = typeDefs;
