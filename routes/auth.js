const express = require("express");
const route = express.Router();

// ---------------------------------------------------------
const { authMiddleware } = require("../middlewares/auth");

// ---------------------------------------------------------
const UserController = require("../controller/user");

route.post("/login", UserController.login);

route.post("/logout", UserController.logout);

route.post("/create-token-hedera", authMiddleware,   UserController.createdTokens);

route.get("/list-tokens", authMiddleware, UserController.listTokens);

route.post("/register",  UserController.store);


module.exports = route;
