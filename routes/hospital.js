var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');


/*=============================================
Obtener todos los hospitales
===============================================*/
app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Hospital.find()
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (error, hospitales) => {
                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error al obtener los hospitales',
                        errors: error
                    })
                }

                Hospital.count({}, (error, conteo) => {

                    if (error) {
                        return response.status(500).json({
                            ok: false,
                            mensaje: 'Error al contar los hospitales',
                            errors: error
                        })
                    }

                    response.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo

                    });
                });


            })
});
/*=============================================
Obtener todos los hospitales - FIN
===============================================*/



/*=============================================
Actualizar hospital
===============================================*/
app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {

    var id = request.params.id;
    var body = request.body;

    Hospital.findById(id, (error, hospital) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al obtener el hospital',
                errors: error
            })
        }

        if (!hospital) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El hospital con el ' + id + 'no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = request.usuario._id;

        hospital.save((error, hospitalGuardado) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: error
                })
            }

            response.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });
    });

});
/*=============================================
Actualizar hospital - FIN
===============================================*/



/*=============================================
Crear Nuevo hospital
===============================================*/
app.post('/', mdAutenticacion.verificaToken, (request, response) => {

    var body = request.body;

    var hospital = Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: request.usuario._id
    });

    hospital.save((error, hospitalGuardado) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: error
            })
        }
        response.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            hospitalToken: request.hospital

        });
    });

});

/*=============================================
Crear Nuevo hospital - FIN
===============================================*/



/*=============================================
Borrar hospital - FIN
===============================================*/
app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {

    var id = request.params.id;

    Hospital.findByIdAndRemove(id, (error, hospitalBorrado) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: error
            })
        }

        if (!hospitalBorrado) {
            return response.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese ID',
                errors: { message: 'No existe un hospital con ese ID' }
            })
        }

        response.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });
});


/*=============================================
Borrar usuario - FIN
===============================================*/



module.exports = app;