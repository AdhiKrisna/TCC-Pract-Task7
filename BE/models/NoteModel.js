import { Sequelize } from "sequelize";
import db_instance from "../config/database.js";

const Notes = db_instance.define(
    "notes",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title : Sequelize.STRING,
        content : Sequelize.STRING
    },
    {
        timestamps : true
    }
)

db_instance.sync().then(() => console.log("Database synced successfully"));

export default Notes;