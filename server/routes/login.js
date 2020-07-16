const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {pool} = require('../config/pgconfig');

const app = express();

app.post('/login', (req, res) => {

    let {email, password} = req.body;

    pool.query(`SELECT* FROM usuario WHERE email=$1`,
    [email], (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Internal Server Error"
            });
        }

        if(usuarioDB.rowCount ===0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                },
               
            });
        }
        
        if (!bcrypt.compareSync(password,usuarioDB.rows[0].password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }
        
        //Crea el token
        let token = jwt.sign({
            usuario: usuarioDB.rows[0]
        }, process.env.SEED,
        {expiresIn: process.env.CADUCIDAD_TOKEN});
        
        res.json({
            ok: true,
            usuario: usuarioDB.rows[0],
            token
        });
    });
});

module.exports = app;