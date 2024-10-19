require("dotenv").config();
const {Sequelize} = require('sequelize');


const isDev = process.env.NODE_ENV !== 'production';
const db = process.env.MYSQL_DATABASE;
const userName = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST;
const port = isDev ? process.env.MYSQL_PORT : 3306;

const sequelize = new Sequelize(db,userName,password,{
    port,
    host,
    dialect: 'mysql',
});

const dbConnectSQL = async () => {
    try {
        console.log("DB CONECTED");
        await sequelize.authenticate();
    } catch (error) {
        console.log(error);
    }
}
module.exports = {sequelize, dbConnectSQL};
