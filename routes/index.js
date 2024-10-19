const express = require('express');
const fs = require('fs');
const route = express.Router();
const {removeExtension} = require('../utils/handleRemoveExtension');
const PATH_ROUTES = __dirname;

fs.readdirSync(PATH_ROUTES).filter((file)=>{
    const name = removeExtension(file);
    if(name!=="index"){
        console.log(`Cargando rutas ${name}`);
        route.use(`/${name}`,require(`./${file}`));
    }
    
});


module.exports = route;