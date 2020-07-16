const express = require('express');
const {pool} = require('../config/pgconfig');

const {verificaToken /*, verificaAdmin_Role*/} = require ('../middlewares/autentication');
const app = express();

app.post('/userRoutes', verificaToken, (req, res) => {

/*SELECT origen, destino, transporte,ST_DISTANCE(rutas.coordenadas_o::geography, 'SRID=4326;POINT(-103.3739157 20.6753706)'::geography) as dis1,
ST_DISTANCE(rutas.coordenadas_d::geography, 'SRID=4326;POINT(-103.3826695 20.6899275)'::geography) as dist2 FROM rutas WHERE
ST_DISTANCE(rutas.coordenadas_o::geography, 'SRID=4326;POINT(-103.3739157 20.6753706)'::geography)<1000 AND
ST_DISTANCE(rutas.coordenadas_d::geography, 'SRID=4326;POINT(-103.3826695 20.6899275)'::geography)< 1000.00;

`SELECT user_id, ruta, coordenadas_o, coordenadas_d, origen, destino, titulo, transporte,
    ST_DISTANCE(rutas.coordenadas_o::geography, 'SRID=4326;POINT($1 $2)'::geography) as distancia1,
    ST_DISTANCE(rutas.coordenadas_d::geography, 'SRID=4326;POINT($3 $4)'::geography) as distancia2 FROM rutas WHERE
    ST_DISTANCE(rutas.coordenadas_o::geography, 'SRID=4326;POINT($1 $2)'::geography) <1000 AND
    ST_DISTANCE(rutas.coordenadas_d::geography, 'SRID=4326;POINT($3 $4)'::geography)< 1000. AND
    transport = $5`
    
*/

    let x1 =(req.body.coordinates1.lng);
    let y1 =(req.body.coordinates1.lat);
    let x2 =(req.body.coordinates2.lng);
    let y2 =(req.body.coordinates2.lat);   
    let transport = (req.body.transport);
    console.log(x1,y1,x2,y2)
  
    pool.query(`SELECT viaje_id, user_id, ruta, coordenadas_o, coordenadas_d, origen, destino, titulo, transporte,
    ST_DISTANCE(rutas.coordenadas_o::geography, 'SRID=4326;POINT(${x1} ${y1})'::geography) as distancia1,
    ST_DISTANCE(rutas.coordenadas_d::geography, 'SRID=4326;POINT(${x2} ${y2})'::geography) as distancia2 FROM rutas WHERE
    ST_DISTANCE(rutas.coordenadas_o::geography, 'SRID=4326;POINT(${x1} ${y1})'::geography) <1000 AND
    ST_DISTANCE(rutas.coordenadas_d::geography, 'SRID=4326;POINT(${x2} ${y2})'::geography) <1000 AND
    rutas.transporte=$1;`,[transport], (err, rutas) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            conteo: rutas.rowCount,
            rutas: rutas.rows
        });

    });
    
}); 


/*`SELECT row_to_json(fc) FROM (
                    SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (
                        SELECT 'Feature' As type, ST_AsGeoJSON(ST_Transform(rt.ruta,4326))::json As Geometry, 
                        row_to_json((viaje_id,titulo)) As properties FROM rutas As rt WHERE rt.viaje_id = $1
                    ) As f
                ) As fc`*/

app.get('/userRoutes/:id', verificaToken, (req,res) => {
    let id = parseInt(req.params.id)
    pool.query(`SELECT viaje_id, user_id, ST_AsGeoJSON(ST_Transform(ruta,4326))::json As ruta,
    ST_AsGeoJSON(ST_Transform(coordenadas_o,4326))::json As coordenadas_o, ST_AsGeoJSON(ST_Transform(coordenadas_d,4326))::json As coordenadas_d,
    origen, destino, titulo, transporte, fecha_destino, fecha_publicado As fecha_creado FROM rutas As rt WHERE rt.viaje_id=$1`, [id],
        (err, ruta) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            conteo: ruta.rowCount,
            ruta: ruta.rows
        });

    });
})

app.post('/userRoutes/add', verificaToken, (req, res) =>{
    let body= req.body;
    console.log(body);
    let {user_id, ruta,origen, destino, titulo,transporte, fecha_destino} = req.body;
    let x1 = req.body.coordenadas_o.lng;
    let y1 = req.body.coordenadas_o.lat;
    let x2 = req.body.coordenadas_d.lng;
    let y2 = req.body.coordenadas_d.lat;
    console.log(user_id, ruta, x1,y1,x2,y2, origen, destino, titulo, transporte, fecha_destino)

    pool.query(`INSERT INTO rutas(user_id, ruta, coordenadas_o, coordenadas_d, origen, destino, titulo, transporte)
    VALUES($1, ST_SetSRID(ST_GeomFromGeoJSON($2),4326), ST_SetSRID(ST_MakePoint($3,$4),4326), ST_SetSRID(ST_MakePoint($5,$6),4326),
        $7, $8, $9, $10)`,  [user_id, ruta, x1, y1, x2, y2, origen, destino, titulo,transporte],
        (err, rutaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.status(201).json({
                ok: true,
                ruta: rutaDB.command
            });
        });
});





module.exports = app;
