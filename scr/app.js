// archivo scr\app.js
const fs = require('fs');
const express = require('express');
const app = express();
const puerto = 3000;

app.use(express.json());

app.post('/guardarFacturas', (req, res) => {
    const rutaArchivo = 'scr/files/facturas/facturas.json';
    const facturas = req.body;

    fs.writeFile(rutaArchivo, JSON.stringify(facturas, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al guardar las facturas en el servidor.');
        } else {
            res.send('Facturas guardadas exitosamente en el servidor.');
        }
    });
});

app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
