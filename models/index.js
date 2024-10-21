const Sequelize = require('sequelize');
const sequelize = require('../config/mysql').sequelize;
const fs = require('fs');
const {removeExtension} = require('../utils/handleRemoveExtension');
const PATH_ROUTES = __dirname;

const archivo = [];

fs.readdirSync(PATH_ROUTES).filter((file) => {
    const name = removeExtension(file);
    if(name!='index'){
        archivo.push(name);
    }
});
const models = {
    user: require('./user')(sequelize, Sequelize.DataTypes, Sequelize.Model),
    account: require('./account')(sequelize, Sequelize.DataTypes, Sequelize.Model),
};

module.exports = models;
