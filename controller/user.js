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
const { user } = require("../models");
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
      console.error(error); // Imprime el error en la consola
      res.status(500).json({ error: error.message });
    }
  };
  
  logout = async (req, res) => {
    try {
      return res.status(200).json({ success: true, token: "null" });
    } catch (error) {
      console.error("Error in logout:", error);
      res.status(500).json({ error: error.message });
    }
  };

  store = async (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;

      // Encriptar el password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generar un token único con email y password
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
      return res.status(200).json({ Success: true,  "Account number": tokenReceipt.tokenId.toString() });
    } catch (err) {
      console.error(err);
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

      res.status(200).json(balance);
    } catch (error) {
      console.error("Error in listTokens:", error);
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new UserController();
