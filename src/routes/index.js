const express = require('express');
const router = express.Router();
const multer = require('multer');
//const upload = multer({dest: 'src/documentos/'})
const fs = require('fs');
//const Student = require('../models/CartaEstudiante');
//const Teacher = require('../models/CartaDocente');

//aljand
//const Estudiantes = require('../models/estudiantes');
const Login = require('../models/login');
//>>>>>>>>>>>>>>>>>>>

//const Student = require('../models/student');
const Career = require('../models/career');
const Facultad = require('../models/faculty');
const bodyParser = require('body-parser');
const Agrupare = require('../models/agruparestudiante');
const Agrupard = require('../models/agrupardocente');
const Docente = require('../models/ResolucionDocente');
const Estudiante = require('../models/estudiantes');
const Student = require('../models/CartaEstudiante');
const Teacher = require('../models/CartaDocente');

const Pdf = require('../models/pdf');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null ,'src/documentos/')//aqui se define el lugar donde se almacena la imagen
  },
  filename: function (req, file, cb) {
    console.log("-------------------------");
    console.log(file);

    //cb(null, file.originalname + "-" +  Date.now() );
    cb(null, file.fieldname + '-' +  Date.now() )
  }
});
const upload = multer({storage : storage}).single('doc');



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

//servicio para añadir a facultad
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<
router.post('/addf', async (req, res) =>{
const facultad = new Facultad(req.body);
await facultad.save();
console.log(facultad);
//res.redirect('/');
res.send('received');
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><

//servicio para añadir a carrera con id
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>




//const Estudiantes = require('../models/ResolucionEstudiante');

// router.get('/', async (req, res) => {
//   const estudiantes = await Estudiantes.find();
//   res.render('index',{
//     estudiantes
//   });
// });

// >>>>aljand
//servicio para añadir a models estudiantes.js
router.post('/addResEstu', async (req, res) => {
  const estudent = new Estudiantes(req.body);
  await estudent.save();
  const { id } = estudent._id;
  res.redirect('/');
});

router.post('/addResDoc/:id', async (req, res) =>{
  const ida = req.params;

  const dc = {
    noresolucion : req.body.nod,
    nodictamen : req.body.nor,
    obs : req.body.obs
  };
  const docente = new Docente(dc);
  Agrupard.findOne({_id : (ida.id)}).exec( async (err, docs) =>{
    if(err){
      res.send(err);
    }
    else {
      if(docs != ""){
        const ida = docs.id;
        docente.ida_a= ida.id;
        await docente.save();
        res.status(200).json({
          "id" : docs,
          "msn" : "existe "
        });
      }
      else {

        res.status(200).json({
          "id" : error,
          "info" : d
        })
      }
    }
  })
});

/*router.post('/env', upload.any(), function (req, res, next){
  res.send(req.files);
});*/

router.post('/env', function (req, res){
  upload(req, res, function (err){
    if(err){
      res.send('err');
      return ;
    }
    res.send('img');
    return;
  })
});

//servicio para añadir a agrupar docente
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post('/addADoc', async (req, res)=>{
  const agr = {
    carrera : req.body.carrera,
    gestion : req.body.gestion,
    periodo : req.body.periodo
  };
  const agrupard = new Agrupard(agr);
  const race = agrupard.carrera;
  Agrupard.find({carrera: req.body.carrera, gestion: req.body.gestion, periodo: req.body.periodo}).exec( (err, docs) => {
    if(err){
      res.send('error');
    }
    else{
      if(docs != ""){
        res.status(200).json({
          "id" : docs._id,
          "msn" : "existe "
        });
      }
      else {
        Career.findOne({carrera : race}).exec( async(error, dc) =>{
          if(error){
            res.status(200).json({
              "msn" : "errorrr "
            });
          }
          else {
            await agrupard.save();
            res.status(200).json({
              "ida": agrupard._id,
              "msn":"creado"
            })
          }
        })
      }
    }
  })
//  const docente = new Docente(req.body);
  //const { id } = docente._id;
  //await docente.save();
});


router.post('/addAEst', async (req, res)=>{
  const agr = {
    carrera : req.body.carrera,
    gestion : req.body.gestion,
    periodo : req.body.periodo
  };
  const agrupare = new Agrupare(agr);
  const race = agrupare.carrera;

  Agrupare.find({ carrera: req.body.carrera , gestion: req.body.gestion,periodo : req.body.periodo}).exec(async (err, docs) =>{
    if(err ){
      console.log(docs);
      res.send(' no encontro');
    }

    else{
      if(docs == ""){
        console.log(docs);
        Career.findOne({nombre : race }).exec( async (error, docs)=>{
          if(error){
            res.status(200).json({
              "msn" : error
            });
            return
          }
          else {
            if(docs!= null){
              await agrupare.save();
              const ide  = agrupare._id;
              res.send('listo');
            }
            else{
              res.status(200).json({
                "msn": "no se encuentra"
              })
              return
            }
          }

          return
        })
      }
      else{
        console.log(docs);
        res.send('encontro');
        res.send(docs._id);
      }

    }
  })

//  const docente = new Docente(req.body);
  //const { id } = docente._id;
  //await docente.save();
});



router.post('/EstDic/:id', async(req, res) =>{
  const ida = req.params;
  const est = {
    numResolucion : req.body.nr,
    numDictamen : req.body.nd,
    pdf : "",
  };
  const estudiante = new Estudiante(est);
  Agrupare.findOne({_id : ida.id}).exec( (err, docs) =>{

  })
})

router.post('/cartEst/:id', async(req, res) =>{
  const  idg = req.params;
  const student = {
    nombre : req.body.nombre,
    apellido : req.body.apellido,
    obs : req.body.obs,
    pdf : ""
  };
  const univ = new Student(student);
  univ.id_ResEst = idg.id;
  console.log(idg);
  Estudiante.findOne({_id : idg.id}).exec (async (error, docs)=>{
    if(error){
      message : error
      return
    }
    else {
      if(docs != null){
        await univ.save();
        res.send('enviado');
      }

      else{
        res.send('pero que')
      }
    }
    return
  })
});

router.post('/cartDoc/:id', async(req, res) =>{
  const  idg = req.params;
  const teacher = {
    nombre : req.body.nombre,
    apellido : req.body.apellido,
    obs : req.body.obs,
    pdf : ""
  };
  const doc = new Teacher(teacher);
  doc.id_ResDoc = idg.id;
  console.log(idg);
  Docente.findOne({_id : idg.id}).exec (async (error, docs)=>{
    if(error){
      message : error
      return
    }
    else {
      if(docs != null){
        await doc.save();
        res.send('enviado');
      }

      else{
        res.send('pero que')
      }
    }
    return
  })
});

router.get('/filtroG', async (req, res) =>{
  const params = req.query;
  const race = params.carrera;
  const year = params.year;
  //const periodo = params.periodo;
  console.log(req.query);
  console.log(year);
//  const tipo = params.tipo;
//db.prueba.find({ $text : { $search: '"Miguel Quijote"'} });
Agrupare.find({carrera : race, gestion : year}).exec( (err, docs) =>{
  if (docs){
    const  idg  = docs;
    console.log(idg);
    res.status(200).json({
      info:  docs,

     });
  }
  else{
    res.status(201).json({
        "msn" : "no existe "
      });
  }
})
});

router.get('/filtroRes/:id', async(req, res) =>{
  const idg = req.params;
  Estudiante.find({id_a : (idg.id)}).exec( (err, docs) =>{
    if(docs){
      res.status(200).json({
        info:  docs
       });
    }
    else {
      res.status(201).json({
          "msn" : "no existen "
        });
    }
  })
});
// metodo actualizar
//>>>>>>>>>>>>>><

// >>>>aljand

// //Rutas sencillas para mostrar ventanas
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get('/regUSER', async (req, res) => {
  res.render('registrarUsuarios');
});

//esto muestra la venta grupo docnetes
router.get('/gDoc', async (req, res) => {
  const GetDocente = await Agrupard.find();
  res.render('grupoDocentes',{
    GetDocente
  });
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//servicio para añadir a models estudiantes.js
router.post('/addResEstu', async (req, res) => {
  const estudent = new Estudiantes(req.body);
  await estudent.save();
  const { id } = estudent._id;
  res.redirect('/');
});

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

  Login.find({email:req.body.email, password:req.body.password, },function(err, docs){
    console.log(docs);
    res.render('mostrarResolucion');
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

// servicio para mostrar datos
//mostrar datos de facultades
router.get("/facultadesGET", (req, res, next) =>{
  Facultad.find({}).exec( (error, docs) => {
      res.status(200).json(docs);
  })
});

//mostrar carreras
router.get("/CarrerasGET", (req, res, next) =>{
  Career.find({}).exec( (error, docs) => {
      res.status(200).json(docs);
  })
});





module.exports = router;
