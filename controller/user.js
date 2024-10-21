const {
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenInfoQuery,
  TokenId,
  AccountId,
  AccountBalanceQuery,
  Hbar,
  Client,
} = require("@hashgraph/sdk");
const { user, account } = require("../models");
const jwt = require("jsonwebtoken");
const { PrivateKey } = require("@hashgraph/sdk");
const bcrypt = require("bcrypt");

class UserController {
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const existingUser = await user.findOne({ where: { email } });

      if (!existingUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const token = jwt.sign(
        { email, password: existingUser.password },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({ name: existingUser.firstName, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  logout = async (req, res) => {
    try {
      return res.status(200).json({ success: true, token: "null" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  store = async (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = jwt.sign(
        { email, password: hashedPassword },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      const newUser = await user.create({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });

      return res.status(201).json({ success: true, token });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ error: "El correo electrónico ya está en uso" });
      }
      res.status(500).json({ error: error.message });
    }
  };

  createdTokens = async (req, res) => {
    try {
      const { name, symbol, supply } = req.body;
      const client = Client.forTestnet();
      const privateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
      client.setOperator(process.env.MY_ACCOUNT_ID, privateKey);

      const token = await new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setDecimals(2)
        .setInitialSupply(supply)
        .setTreasuryAccountId(process.env.MY_ACCOUNT_ID)
        .setMaxTransactionFee(new Hbar(30))
        .execute(client);

      const tokenReceipt = await token.getReceipt(client);
      const tokenId = tokenReceipt.tokenId.toString();

      if (tokenReceipt.status.toString() === "SUCCESS") {
        await account.create({
          account: tokenId,
          name: name,
        });

        return res
          .status(200)
          .json({ Success: true, "Account number": tokenId });
      } else {
        return res.status(500).json({ error: "Token creation failed" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  listTokens = async (req, res) => {
    try {
      const client = Client.forTestnet();

      const privateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
      client.setOperator(process.env.MY_ACCOUNT_ID, privateKey);

      const accountIdString = process.env.MY_ACCOUNT_ID;
      const accountId = AccountId.fromString(accountIdString);
      const query = new AccountBalanceQuery().setAccountId(accountId);
      const balance = await query.execute(client);
      const tokenBalances = balance.tokens._map;
      const tokenBalancesJson = [];

      for (const [tokenId, tokenBalance] of tokenBalances) {
        const accountRecord = await account.findOne({
          where: { account: tokenId.toString() },
        });
        tokenBalancesJson.push({
          tokenId: tokenId.toString(),
          balance: tokenBalance.toString(),
          name: accountRecord ? accountRecord.name : " ~ ",
        });
      }

      res.status(200).json(tokenBalancesJson);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new UserController();
