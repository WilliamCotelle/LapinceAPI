import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export class Transaction extends Model {}

Transaction.init(
  {
    transaction_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true, // Description est optionnelle
    },
  },
  {
    sequelize,
    tableName: "transaction",
    timestamps: false,
  }
);

export default Transaction;
