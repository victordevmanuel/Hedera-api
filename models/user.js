const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/mysql");

module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        static associate(models) {
            // Aquí puedes definir las asociaciones si las necesitas en el futuro
        }
    }

    user.init(
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "user",
        }
    );

    return user;
};