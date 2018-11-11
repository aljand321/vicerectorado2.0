const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
const app = express();

//conectar a la base de datos
mongoose.connect('mongodb://localhost/vicerectorado')
  .then(db => console.log('Db connect'))
  .catch(err => console.log(err));

// importar rutas
const indexRoutes = require('./routes/index');


//configurar
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extend: true}));
//rutas
app.use('/', indexRoutes);



// iniciar servicio
app.listen(app.get('port'), () =>{
  console.log(`Server on port ${app.get('port')}`);
});
