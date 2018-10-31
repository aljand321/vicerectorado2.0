const express = require('express');
const router = express.Router();

const Student = require('../models/student');
const Career = require('../models/career');
const Facultad = require('../models/faculty');
const bodyParser = require('body-parser');
const Agrupare = require('../models/agrupare');

router.get('/', async(req, res) => {
const student = await Student.find();
res.render('index',{
  student // student:student
});
});

router.post('/add', async (req, res) =>{
const student = new Student(req.body);
await student.save();
console.log(student);
res.redirect('/');
//res.send('received');
});

router.post('/addf', async (req, res) =>{
const facultad = new Facultad(req.body);
await facultad.save();
console.log(facultad);
//res.redirect('/');
res.send('received');
});

router.post(/race\/[a-z0-9]{1,}$/, async (req, res) =>{
  var url = req.url;
  var id = url.split("/")[2];
  const career = new Career(req.body);
Facultad.findOne({_id : id}).exec((error, docs) => {
  //User.findOne({
  if(error){
    res.status(200).json({
      "msn" : error
    })
    return
  }
  if(docs != null){
    var id= docs._id;
    career.id_f = id;

    //console.log(inmuebles);
    var cData = new Career(career);
    var id_in = cData.facu;
    cData.save();
  }
  else{
    res.status(200).json({
      "msn" : "la facultad no existe ,el id esta mal"
    })
  }
})
await career.save();
console.log(career);
//res.redirect('/');
res.send('received');
});

//router.post('/add')



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
