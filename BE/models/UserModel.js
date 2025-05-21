import { Sequelize } from "sequelize";
import db from "../config/database.js";

// Membuat tabel "users"
const User = db.define(
  "user", // Nama Tabel
  {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    refresh_token: Sequelize.TEXT,
  }
);

db.sync().then(() => console.log("Database synced"));

export default User;