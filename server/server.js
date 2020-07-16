require('./config/config');
const express = require('express');
const cors = require ('cors');  //permite hacer peticiones locales desde el navegador
const {createTables,dbConnection} = require ('./config/pgconfig');

const app = express();
app.use(cors());

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// Configuración global de rutas
app.use(require('./routes/index'));

//conectar base de datos aqui
dbConnection();
//Create tables
createTables();

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});

