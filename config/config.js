require("dotenv").config();

module.exports = {
    development: {
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: "mysql",
    },
    production: {
        username: "admin",
        password: "123456",
        database: "node_api",
        host: "localhost",
        dialect: "mysql",
    },
};
