// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3001;


// ============================
//  Entorno
// ============================
const isProduction = process.env.NODE_ENV === 'production';


// ============================
//  Vencimiento del Token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN =1000* 60 * 60 * 24 * 30;

//process.env.CADUCIDAD_TOKEN = 60;


// ============================
//  SEED de autenticación
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ============================
//  Base de datos
// ============================

let DB_USER="alan";
let DB_PASSWORD=674188;
let DB_HOST="localhost";
let DB_PORT=5432;
let DB_DATABASE="movilidad";

const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;


let urlDB;

/*
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

*/

module.exports= {connectionString, isProduction};