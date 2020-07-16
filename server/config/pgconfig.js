require('../config/config');
const {connectionString, isProduction}= require ('./config');
const {Pool} = require('pg');

//database connection
const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction,
    
});
//check database connection
const dbConnection = () => {
    pool.query('SELECT NOW()', (err,res) => {
        if (err) throw err;
        console.log('Base de datos ONLINE');
    });
};

//create table users
const createUserTable = () => {
    const queryText = 
    `CREATE TABLE IF NOT EXISTS usuario(
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        lastName VARCHAR(128) NOT NULL,
        birthday TIMESTAMP,
        gender VARCHAR(128),
        transport VARCHAR(128),
        email VARCHAR(128) NOT NULL UNIQUE,
        password VARCHAR(128),
        phone INTEGER,
        picture VARCHAR(128),
        status BOOLEAN NOT NULL DEFAULT TRUE
    )`;

    pool.query(queryText).then((res) => {
    }).catch((err) => {
        console.log(err);
    });
};

const createRoutesTable = () => {
    const queryText = 
    `CREATE TABLE IF NOT EXISTS rutas(
        viaje_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        ruta geometry(Linestring,4326),
        coordenadas_o geometry(Point,4326),
        coordenadas_d geometry(Point,4326),
        origen VARCHAR,
        destino VARCHAR,
        titulo VARCHAR,
        transporte VARCHAR(128) NOT NULL,
        fecha_destino TIMESTAMP,
        fecha_publicado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES usuario(user_id) ON DELETE CASCADE
    )`;

    pool.query(queryText).then((res) => {
        }).catch((err) => {
            console.log(err);
            pool.end();
        });
}

const createTables = () => {
    createUserTable();
    createRoutesTable();
}

 module.exports = {createTables,dbConnection, pool};
