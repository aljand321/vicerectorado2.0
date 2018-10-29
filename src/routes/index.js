const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/addResEstu', (req, res) => {
  console.log(req.body);
  res.send('exito');
});

module.exports = router;
