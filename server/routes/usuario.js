const express = require('express');
const bcrypt = require('bcrypt');
const _=require('underscore');
const {pool} = require('../config/pgconfig');

const {verificaToken, verificaAdmin_Role} = require ('../middlewares/autentication');

const app = express();

app.get('/usuario',/* verificaToken,*/ (req, res) => {

    pool.query(`SELECT* FROM usuario WHERE status = true`, (err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            conteo: usuarios.rowCount,
            usuarios: usuarios.rows
        });

    });
    
}); 

app.post('/usuario', /*[verificaToken,verificaAdmin_Role],*/ function(req,res){

    let body = req.body;
    console.log('ESTE ES EL BODY',body);

    let {name, lastname, birthday,gender, transport, email, phone, picture, status} = req.body;
    let password = bcrypt.hashSync(req.body.password,10);

    pool.query(`INSERT INTO usuario(name, lastname, birthday, gender, 
    transport, email, password, phone, picture, status)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [name, lastname, birthday,gender, transport, email,password, phone, picture,status], (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.status(201).json({
            ok: true,
            usuario: usuarioDB.command
        });
    });
});

app.put('/usuario/:id',/* [verificaToken, verificaAdmin_Role],*/function(req, res) {
    
    let body = req.body;
    let id = req.params.id;
    let {name, lastname, birthday, gender, transport, email, phone, picture, status} = req.body;
    let password = bcrypt.hashSync(req.body.password,10);
    pool.query(`UPDATE usuario SET name=$1, lastname=$2, birthday=$3, gender=$4, transport=$5,
    email=$6, password=$7, phone=$8, picture=$9, status=$10 WHERE user_id = $11`,
    [name, lastname, birthday,gender, transport, email, password, phone, picture, status, id], (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: {
                message: `Usuario con ID: ${id} actualizado`
            },
        })
    })
})

app.delete('/usuario/:id', /*[verificaToken,verificaAdmin_Role],*/ function(req,res) {
    let id = req.params.id;
    let statusU = false;
    pool.query(`UPDATE usuario SET status=$1 WHERE user_id=$2`, [statusU, id], (err,usuarioDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        
        if(usuarioDB.rowCount ===0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: {
                message: `Usuario con ID: ${id} borrado`
            },
            
        });
    });
});

module.exports = app;