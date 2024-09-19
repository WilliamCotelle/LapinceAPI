import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export class Budget extends Model {}

Budget.init(
  {
    limitAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_category: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_bank_account: {
      type: DataTypes.INTEGER, // Nouvelle colonne pour lier le budget au compte bancaire
      allowNull: false,
    },
    notificationSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Pour indiquer si la notification a été envoyée
    },
  },

  {
    sequelize,
    tableName: "budget",
  }
);
