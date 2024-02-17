const typeDefs = `
  type User {
    _id: ID!
    firstName: String
    lastName: String
    username: String
    email: String
    password: String
    accounts: [Account]!
    transactions: [Transaction]!
  }

  type Account {
    _id: ID!
    accountName: String
    description: String
    institution: Institution!
    type: String
    currency: String
    startingBalance: Float
    calculatedBalance: Float
    transactions: [Transaction]!
    user: User!
  }

  type Institution {
    _id: ID!
    name: String
    otherInfo: String
    accounts: [Account]!
    user: User!
  }

  type Transaction {
    _id: ID!
    account: Account!
    purchaseDate: String
    transfer: Boolean
    payee: ID!
    category: CategoryName
    amount: Float
    split: Boolean
    related: Transaction!
    cleared: Boolean
    user: User!
  }

  type CategoryName {
    _id: ID!
    categoryName: String
    categoryType: CategoryType
    user: User!
  }

  type CategoryType {
    _id: ID!
    categoryTypeName: String
    categories: [CategoryName]!
    user: User!

  }

  type Payee {
    _id: ID!
    name: String
    user: User!
  }

  type Auth {
    token: ID!
    user: User!
  }

  type Query {
    users: [User]
    user(username: String!): User
    accounts(username: String): [Account]
    account(accountId: ID!): Account
    me: User
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addInstitution(name: String!, otherInfo: String!): Institution
    removeInstitution(institutionId: ID!): Institution
    addCategoryType(categoryTypeName: String!): CategoryType
    removeCategoryType(categoryTypeId: ID!): CategoryType
    addCategoryName(categoryName: String!, categoryType: ID!): CategoryName
    removeCategoryName(categoryNameId: ID!): CategoryName
    addPayee(name: String!): Payee
    removePayee(payeeId: ID!): Payee
    addAccount(accountName: String!, description: String!, institution: ID!, type: String!, currency: String!, startingBalance: Float! ): Account
    removeAccount(accountId: ID!): Account
    addTransaction(accountId: ID!, transfer: Boolean!, payee: ID!, category: ID!, amount: Float!, split: Boolean!, related: ID!, cleared: Boolean!): Transaction
    removeTransaction(accountId: ID!, transactionId: ID!): Transaction
  }
`;

module.exports = typeDefs;

