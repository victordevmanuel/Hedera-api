const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/mysql");

module.exports = (sequelize, DataTypes) => {
    class account extends Model {
        static associate(models) {
            // Aquí puedes definir las asociaciones si las necesitas en el futuro
        }
    }

    account.init(
        {
            account: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "account",
        }
    );

    return account;
};
