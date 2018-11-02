const express = require('express');
const router = express.Router();
var multer = require('multer');
var fs = require('fs');
//const Student = require('../models/CartaEstudiante');
//const Teacher = require('../models/CartaDocente');

//aljand
const Estudiantes = require('../models/estudiantes');
const Login = require('../models/login');
//>>>>>>>>>>>>>>>>>>>

//const Student = require('../models/student');
const Career = require('../models/career');
const Facultad = require('../models/faculty');
const bodyParser = require('body-parser');
const Agrupare = require('../models/agruparestudiante');
const Agrupard = require('../models/agrupardocente');
const Docente = require('../models/ResolucionDocente');
const Pdf = require('../models/pdf');

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null ,'./documentos')//aqui se define el lugar donde se almacena la imagen
  },
  filename: function (req, file, cb) {
    console.log("-------------------------");
    console.log(file);
    cb(null, file.originalname + "-" +  Date.now() );
  }
});
var upload = multer({storage : storage}).single('doc');

router.get('/', async (req, res) => {
  const user = await Login.find();
  res.render('index',{
    user
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


// >>>>aljand
//servicio para añadir a models estudiantes.js
router.post('/addResEstu', async (req, res) => {
  const estudent = new Estudiantes(req.body);
  await estudent.save();
  const { id } = estudent._id;
  res.redirect('/');
});

router.post('/addResDoc', async (req, res) =>{
  const dc = {
    nod : req.body.nod,
    nor : req.body.nor,
    obs : req.body.obs
  };
  const docente = new Docente(dc);
  await docente.save();
  const ida = docente._id;
  upload(req, res ,(err) => {
    if(err){
      res.status(500).json({
        "msn" : "No se ha podido subir el documento"
      });
    }
    else{
      var ruta = req.file.path.substr(6, req.file.path.length);
      console.log(ruta);
      const pdf = {
        id_ref : ida,
        name : req.file.originalname,
        physicalpath : req.file.path,
        relativepath : "http://localhost:3000" + ruta
      };
      const pdfData = new Pdf(pdf);
      pdfData.save().then( (infopdf) => {
        const file = {
          arch : new Array()
        };
        const data = docente.pdf;
        const aux = new Array();
        if(data.length == 1 && data[0] == ""){
          file.arch.push("/addResDoc/"+infopdf._id);
        }
        else{
          aux.push("/addResDoc/"+ infopdf._id);
          data = data.concat(aux);
          file.arch = data;
        }
        Docente.findOneAndUpdate({_id : ida}, file, (err, params) => {
          if(err){
            res.status(500).json({
              "msn" : "erro"
            });
            return;
          }
          res.status(200).json({
            "msn" : "bien"
          })
          return;
        });

      });
    }
  });
});

router.post('/addADoc', async (req, res)=>{
  const agr = {
    carrera : req.body.carrera,
    gestion : req.body.gestion,
    date : req.body.date
  };
  const dc = {
    nod : req.body.nod,
    nor : req.body.nor,
    pdf : "",
    obs : req.body.obs
  };
  const agrupard = new Agrupard(agr);
  const race = agrupard.carrera;
  Career.findOne({nombre : race }).exec( async (error, docs)=>{
    if(error){
      res.status(200).json({
        "msn" : error
      })
      return
    }
    if(docs!= null){
      await agrupard.save();
      const ida  = agrupard._id;
      const docente = new Docente(dc);
      docente.id_a = ida;
      Agrupard.findOne({_id : ida}).exec( async (err, docs)=>{
        if(err){
          res.status(200).json({
            "msn" : err
          })
          return
        }
        if(docs!=null){
          await docente.save();
          var idd = docente._id;
          upload(req, res, (error) => {
            if(error){
              res.status(500).json({
                "msn" : "No se ha podido subir la imagen"

              });
            }else{
              var ruta = req.file.path.substr(6, req.file.path.length);
              console.log(ruta);
              var pdf = {
                id_ref : idd,
                name : req.file.originalname,
                idhome: req.file.path,
                physicalpath : req.file.path,
                relativepath : "http://localhost:3000" + ruta
              };
              var pdfDato = new Pdf(pdf);

              pdfDato.save().then( () => {
                res.status(200).json( req.file);
              });
            }
          });
        }
        else{
          res.send('no existe');
        }
        return
      })
      res.send('listo');
    }
    else{
      res.status(200).json({
        "msn": "no se encuentra"
      })
      return
    }
    return
  })



//  const docente = new Docente(req.body);
  //const { id } = docente._id;
  //await docente.save();
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

router.get('/regUSER', async (req, res) => {
  res.render('registrarUsuarios')
});

//>>>>>>>>>
// // servicio para registrar un nuevo usuario
// <<<<<<<<<<<<<<<<<<<<
router.post("/users", function(req, res) {
  var user = new Login({
                        nombres: req.body.nombres,
                        apellidos: req.body.apellidos,
                        email: req.body.email,
                        password: req.body.password,
                        password_confirmation: req.body.password_confirmation
                      });

     user.save().then(function(us){
       res.render('index')
     },function(err){
       if(err){
         console.log(String(err));
         res.render('registrarUsuarios');
       }
    });
  // user.save(function(err,user,numero){
  //   if (err){
  //     console.log(String(err));
  //   }
  //   res.render('index')
  // });
});
// >>>>>>>>>>>>>>>>>>>>

//servicio para iniciar sesion
router.post("/sessions",function(req,res){

  Login.find({email:req.body.email, password:req.body.password},function(err,docs){
    console.log(docs);
    res.send("hola esta es una ventana diferente");
  });

});
//>>>>>>>>>>

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
