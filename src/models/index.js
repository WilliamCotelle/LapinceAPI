// Import des modèles
import { sequelize } from "./sequelize.js";
import { User } from "./user.js";
import { BankAccount } from "./bankAccount.js";
import { Transaction } from "./transaction.js";
import { Category } from "./category.js";
import { Budget } from "./budget.js";
import { Notification } from "./notification.js";

// Définir les associations

// Un utilisateur possède plusieurs comptes bancaires
User.hasMany(BankAccount, {
  foreignKey: "id_user",
  as: "bankAccounts",
});
BankAccount.belongsTo(User, {
  foreignKey: "id_user",
  as: "user",
});

// Un compte bancaire peut avoir plusieurs transactions
BankAccount.hasMany(Transaction, {
  foreignKey: "id_bank_account",
  as: "transactions",
});
Transaction.belongsTo(BankAccount, {
  foreignKey: "id_bank_account",
  as: "bankAccount",
});

// Une transaction appartient à une catégorie
Transaction.belongsTo(Category, {
  foreignKey: "id_category",
  as: "category",
});
Category.hasMany(Transaction, {
  foreignKey: "id_category",
  as: "transactions",
});

// Un budget est défini pour une catégorie
Budget.belongsTo(Category, {
  foreignKey: "id_category",
  as: "category",
});
Category.hasOne(Budget, {
  foreignKey: "id_category",
  as: "budget",
});

// Un compte bancaire est associé à un budget
Budget.belongsTo(BankAccount, {
  foreignKey: "id_bank_account",
  as: "bankAccount",
});
BankAccount.hasMany(Budget, {
  foreignKey: "id_bank_account",
  as: "budgets",
});

// Un utilisateur possède plusieurs notifications
User.hasMany(Notification, {
  foreignKey: "id_user",
  as: "notifications",
});

Notification.belongsTo(User, {
  foreignKey: "id_user",
  as: "user",
});

// Exports des modèles et des associations
export {
  User,
  Transaction,
  Category,
  Budget,
  BankAccount,
  Notification,
  sequelize,
};
