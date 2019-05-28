var express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');



var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());


app.put('/:tipo/:id', (request, response, next) => {

    var tipo = request.params.tipo;
    var id = request.params.id;
    var tiposColeccion = ['hospitales', 'medicos', 'usuarios'];
    if (tiposColeccion.indexOf(tipo) < 0) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valido'
        })
    }

    if (!request.files) {
        response.status(400).json({
            ok: false,
            mensaje: 'No selecciono ningun archivo'
        })
    }

    //Obtener Filename
    var archivo = request.files.imagen;
    var archivoExt = archivo.name.split('.');
    var extencionArchivo = archivoExt[archivoExt.length - 1];

    //Extenciones permitidas
    var extencionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extencionesValidas.indexOf(extencionArchivo) < 0) {
        response.status(400).json({
            ok: false,
            mensaje: 'Extencion no valida',
            errors: { message: 'Las extenciones permitidas son: ' + extencionesValidas.join(',') }
        })
    }

    //Nombre de archivo perzonalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`;

    //Mover archivo del Temporal a un Path
    var path = `./uploads/${ tipo }/${ nombreArchivo}`;

    archivo.mv(path, error => {
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: { message: 'Las extenciones permitidas son: ' + extencionesValidas.join(',') }
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, response);

        // response.status(200).json({
        //     ok: true,
        //     mensaje: 'Peticion realizada correctamente'
        // })
    })

});


function subirPorTipo(tipo, id, nombreArchivo, response) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (error, usuario) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: { message: 'El usuario no existe: ' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    console.log('deleted')
                });
            }

            usuario.img = nombreArchivo;

            usuario.save((error, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar el usuario',
                        errors: { message: 'El usuario no se actualizo correctamente' }
                    });
                }

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Peticion realizada correctamente',
                    usuario: usuarioActualizado
                });

            });

        });
    }

    if (tipo === 'medicos') {

        Medico.findById(id, (error, medico) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: { message: 'El medico no existe' }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    console.log('deleted')
                });
            }

            medico.img = nombreArchivo;

            medico.save((error, medicoActualizado) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar el medico',
                        errors: { message: 'El medico no se actualizo correctamente' }
                    });
                }

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Peticion realizada correctamente',
                    medico: medicoActualizado
                });

            });

        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (error, hospital) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: { message: 'El hospital no existe' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    console.log('deleted')
                });
            }

            hospital.img = nombreArchivo;

            hospital.save((error, hospitalActualizado) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar el hospital',
                        errors: { message: 'El hospital no se actualizo correctamente' }
                    });
                }

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Peticion realizada correctamente',
                    hospital: hospitalActualizado
                });

            });

        });
    }
}

module.exports = app;