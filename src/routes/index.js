const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const bodyParser = require('body-parser');

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

router.get('/delete/:id', async (req, res) => {
  const { id }= req.params;
  await Student.remove({_id: id });
  res.redirect('/');
});
module.exports = router;
