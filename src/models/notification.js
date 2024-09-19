import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export class Notification extends Model {}

Notification.init(
  {
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "notification",
    timestamps: true,
  }
);

export default Notification;
