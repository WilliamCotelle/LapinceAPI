import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export class BankAccount extends Model {}

BankAccount.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    initial_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "bank_account",
    timestamps: true,
  }
);

// Assurez-vous d'exporter la classe
export default BankAccount;
