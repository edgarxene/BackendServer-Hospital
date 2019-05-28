var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


/*=============================================
Busqueda por coleccion
===============================================*/
app.get('/coleccion/:tabla/:busqueda', (request, response) => {

    var tabla = request.params.tabla;
    var busqueda = request.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        default:
            return response.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda permitidos son: Usuarios, Medicos y Hospitales',
                error: { message: 'Coleccion no valida' }
            });
    }

    promesa.then(data => {
        response.status(200).json({
            ok: true,
            mensaje: 'Peticion realizada correctamente',
            [tabla]: data
        });
    })

});


/*=============================================
Busqueda General
===============================================*/

app.get('/todo/:busqueda', (request, response, next) => {

    var busqueda = request.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            response.status(200).json({
                ok: true,
                mensaje: 'Peticion realizada correctamente',
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        })

});

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((error, hospitales) => {
                if (error) {
                    reject('Error al relizar la busqueda', error);
                } else {
                    resolve(hospitales);
                }
            });

    });
}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((error, medicos) => {
                if (error) {
                    reject('Error al relizar la busqueda', error);
                } else {
                    resolve(medicos);
                }
            });

    });
}


function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((error, usuarios) => {
                if (error) {
                    reject('Error al relizar la busqueda', error);
                } else {
                    resolve(usuarios);
                }
            })
    });
}


module.exports = app;