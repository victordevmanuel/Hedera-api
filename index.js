require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require('cors');
const { dbConnectSQL } = require("./config/mysql");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 4000;
app.use("/api", routes);


app.listen(PORT, () => {
    console.log("\n----CONEXION OK----");
    console.log("Listen in port: " + PORT);
    console.log("-------------------");
    dbConnectSQL();
    console.log("-------------------");
});
