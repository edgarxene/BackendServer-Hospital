var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');


/*=============================================
Obtener todos los medicos
===============================================*/
app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Medico.find()
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (error, medicos) => {
                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error al obtener los medicos',
                        errors: error
                    })
                }

                Medico.count({}, (error, conteo) => {

                    if (error) {
                        return response.status(500).json({
                            ok: false,
                            mensaje: 'Error al contar los usuarios',
                            errors: error
                        })
                    }

                    response.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });

                });


            })
});
/*=============================================
Obtener todos los medicos - FIN
===============================================*/



/*=============================================
Actualizar medico
===============================================*/
app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {

    var id = request.params.id;
    var body = request.body;

    Medico.findById(id, (error, medico) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al obtener el medico',
                errors: error
            })
        }

        if (!medico) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El medico con el ' + id + 'no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = request.usuario._id;
        medico.hospital = body.hospital;


        medico.save((error, medicoGuardado) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: error
                })
            }

            response.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });
    });

});
/*=============================================
Actualizar medico - FIN
===============================================*/



/*=============================================
Crear Nuevo medico
===============================================*/
app.post('/', mdAutenticacion.verificaToken, (request, response) => {

    var body = request.body;

    var medico = Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: request.usuario._id,
        hospital: body.hospital
    });

    medico.save((error, medicoGuardado) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: error
            })
        }
        response.status(201).json({
            ok: true,
            medico: medicoGuardado,
            medicoToken: request.medico

        });
    });

});

/*=============================================
Crear Nuevo medico - FIN
===============================================*/



/*=============================================
Borrar medico - FIN
===============================================*/
app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {

    var id = request.params.id;

    Medico.findByIdAndRemove(id, (error, medicoBorrado) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: error
            })
        }

        if (!medicoBorrado) {
            return response.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese ID',
                errors: { message: 'No existe un medico con ese ID' }
            })
        }

        response.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });
});


/*=============================================
Borrar medico - FIN
===============================================*/



module.exports = app;