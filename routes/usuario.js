var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');


/*=============================================
Obtener todos los usuarios
===============================================*/
app.get('/', (request, response, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (error, usuarios) => {
                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error al obtener los usuarios',
                        errors: error
                    })
                }
                response.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            })
});
/*=============================================
Obtener todos los usuarios - FIN
===============================================*/



/*=============================================
Actualizar usuario
===============================================*/
app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {

    var id = request.params.id;
    var body = request.body;

    Usuario.findById(id, (error, usuario) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al obtener el usuario',
                errors: error
            })
        }

        if (!usuario) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El usuario con el ' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((error, usuarioGuardado) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: error
                })
            }

            usuarioGuardado.password = ':)';

            response.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });
    });

});
/*=============================================
Actualizar usuario - FIN
===============================================*/



/*=============================================
Crear Nuevo usuario
===============================================*/
app.post('/', mdAutenticacion.verificaToken, (request, response) => {

    var body = request.body;

    var usuario = Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((error, usuarioGuardado) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: error
            })
        }
        response.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: request.usuario

        });
    });

});

/*=============================================
Crear Nuevo usuario - FIN
===============================================*/


/*=============================================
Borrar usuario - FIN
===============================================*/
app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {

    var id = request.params.id;

    Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: error
            })
        }

        if (!usuarioBorrado) {
            return response.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'No existe un usuario con ese ID' }
            })
        }

        response.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});


/*=============================================
Borrar usuario - FIN
===============================================*/

module.exports = app;