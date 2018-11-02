const express = require('express');
const router = express.Router();
const Estudiantes = require('../models/estudiantes');
const Login = require('../models/login');

router.get('/', async (req, res) => {
  const estudiantes = await Estudiantes.find();
  res.render('index',{
    estudiantes
  });
});

//servicio para añadir a models estudiantes.js
router.post('/addResEstu', async (req, res) => {
  const estudent = new Estudiantes(req.body);
  await estudent.save();
  res.redirect('/');
});

// >>>>>>>>>>>>>>>

// metodo actualizar
//>>>>>>>>>>>>>><
// este servicio sirve para cambiar de pestaña recuperando el ID
router.get('/form_paraEditar/:id', async (req, res) => {
  const { id } = req.params;
  const mostrar = await Estudiantes.findById(id);
  res.render('updateEst', {
    mostrar //esto es para mostrar datos
  });
});
//>>>>>>>>>>>>>>>
//este servicio sirve para actualizar datos de un formulario
router.post('/editEst/:id', async (req, res) => {
  const { id } = req.params;
  await Estudiantes.update({_id: id}, req.body);
  res.redirect('/');
});

//>>>>>>>>>>>>>>>>

//>>>>>>>>>
// // servicio para login
// <<<<<<<<<<<<<<<<<<<<
router.post("/users", function(req, res) {
  var user = new Login({email: req.body.email, password: req.body.password, password_confirmation: req.body.password_confirmation});
  user.save(function(err){
    res.send("se guardo los datos que mandaste");
  });
});
// >>>>>>>>>>>>>>>>>>>>
//servicio para mostrar datos del login
router.get("/user", function(req, res){
  Login.find(function(err, doc){
    console.log(doc);
    res.render("user");
  });
});
//>>>>>>>>>>>>>>>>>>>>>>>>>>>


router.get('/delete/:id', async (req, res, next) => {
  let { id }  = req.params;
  await Estudiantes.remove({_id: id });
  res.redirect('/');
});


module.exports = router;
