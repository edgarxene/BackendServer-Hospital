// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')



// Inicializar variables
var app = express();


//Body Parser
// parse application/x-www-form-urlencoded - - application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');





// Conexion a la Base de Datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, respones) => {
    if (error) throw error;
    console.log('Base de Datos: \x1b[35m%s\x1b[0m', 'online!!!');
})

// Rutas
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagenes', imagenesRoutes);

app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[35m%s\x1b[0m', 'online!!!');

});