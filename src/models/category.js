import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export class Category extends Model {}

Category.init({
    name_category:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    logo:{
        type: DataTypes.STRING
    },   
}, {
    sequelize,
    tablename: "category",
});