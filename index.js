// Requerir los mudulos necesario                        
const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser')
//const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// importar las variables
require('dotenv').config({ path: 'variables.env' })
require('./handlers/email');

// Helpers con algunas funciones

const helpers = require('./helpers'); 
 

// Crear la conexion a la BD
const db = require('./config/db');
/*
db.authenticate()
    .then(()=> console.log('Conectado al servidor'))
    .catch(error => console.log(error))
*/

// Importar el modelo 
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');



db.sync()
    .then(()=> console.log('Conectado al servidor'))
    .catch(error => console.log(error))
    



// Para acceder archivo de tu carpeta
const path =  require('path');

// Crear una app de express
const app = express();

 // Donde cargar los archivos estaticos  los archivos de css public
app.use(express.static('public'));


// Habilitar pug
app.set('view engine', 'pug');

 // Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true }));

// Agregamos expressValidador a toda la aplicacion
//app.use(expressValidator());



// Agregar la carpeta de las vistas
app.set('views',path.join(__dirname, './views' ));


// Agregar flash messages
app.use(flash());


app.use(cookieParser());

// sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({ 
    secret: "keyboard cat", 
    resave: false, 
    saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar vardump
app.use((req,res, next)=> {
    //req.user guarda todos los usuarios
    res.locals.usuario = {...req.user} || null;
    
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    next();
});




// Va tomar las rutas de routes
app.use('/', routes());



// Servidor y Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port,host, ()=>{
    console.log('El servidor esta funcionando');
});





