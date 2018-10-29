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

module.exports = router;
