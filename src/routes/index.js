const express = require('express');
const router = express.Router();
const Estudiantes = require('../models/estudiantes');

router.get('/', async (req, res) => {
  const estudiantes = await Estudiantes.find();
  res.render('index',{
    estudiantes
  });
});

router.post('/addResEstu', async (req, res) => {
  const estudent = new Estudiantes(req.body);
  await estudent.save();
  res.redirect('/');
});

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

router.get('/turn/id:', async(req, res)=> {
  const { id }= req.params;
  const student = await Student.findById(id);
  student.gestion = "hoal";
  await student.save();
  res.redirect('/');
});

router.get('/edit/:id', async(req , res) =>{
  const { id }= req.params;
  const student = await Student.findById(id);
  res.render('edit', {
    student
  });//aqui se pone el nombre de la pagina dodne v editar si cambia
});

router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  await Student.update({_id:id }, req.body);
  res.redirect('/');
});

router.get('/delete/:id', async (req, res, next) => {
  let { id }  = req.params;
  await Estudiantes.remove({_id: id });
  res.redirect('/');
});


module.exports = router;
