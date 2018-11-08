const express = require('express');
const router = express.Router();
const multer = require('multer');
//const upload = multer({dest: 'src/documentos/'})
const fs = require('fs');
//const Student = require('../models/CartaEstudiante');
//const Teacher = require('../models/CartaDocente');

//aljand
const Estudiantes = require('../models/estudiantes');
const Login = require('../models/login');
const Data = require('../models/data');
//>>>>>>>>>>>>>>>>>>>

//const Student = require('../models/student');
const Career = require('../models/career');
const Facultad = require('../models/faculty');
const bodyParser = require('body-parser');
const Agrupare = require('../models/agruparestudiante');
const Agrupard = require('../models/agrupardocente');
const Docente = require('../models/ResolucionDocente');
// const Estudiante = require('../models/ResolucionEstudiante');
const Student = require('../models/CartaEstudiante');
const Teacher = require('../models/CartaDocente');

const Pdf = require('../models/pdf');




// const Data = require('../views/insertarResolucionDoc.ejs')

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null ,'src/documentos/')//aqui se define el lugar donde se almacena la imagen
  },
  filename: function (req, file, cb) {
    console.log("-------------------------");
    console.log(file);

    //cb(null, file.originalname + "-" +  Date.now() );
    cb(null, file.fieldname + '-' +  Date.now()+ '.pdf' )
  }
});
const upload = multer({storage : storage}).single('doc');

router.get('/verpdf/id:', async(req, res) =>{
res.render('verPdf', { title: 'Aqui' });
});

router.get('/VERRpdf', async (req, res) => {

  res.render('enviarPDF');
});


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

var idGlobalDocente;
var idPDF;
//servicio para añdir a resolucion docente
router.post('/addResDoc/:id', async (req, res) =>{
  const ida = req.params;
  const dc = {
    noresolucion : req.body.noresolucion,
    nodictamen : req.body.nodictamen,
    pdf : "",
    obs : req.body.obs
  };
  const docente = new Docente(dc);
  Agrupard.find({_id : ida.id}).exec( async (err, docs) =>{
    if(err){
      res.send(err);
    }
    else {
      if(docs != ""){
         docente.id_a = ida.id;
         await docente.save();
        console.log(docs);
        //esto va a mostrar solo la resolcion insertada
        Docente.findOne({id_a : (ida.id)}).exec( async (erro, files) =>{
          if(erro){
            res.send(erro);
          }
          else{
            if(files != ""){
              idPDF = docente._id;
              console.log("Este es le id para el pdf:>) "+idPDF+" (<: ");
            }
            else {
              res.send('no existen los archivos0');
            }
          }
        })
        Docente.find({id_a : (ida.id)}).exec( async (erro, files) =>{
          if(erro){
            res.send(erro);
          }
          else{
            if(files != ""){
              idGlobalDocente = ida.id;
              res.redirect("/MostrarRESdoc");
            }
            else {
              res.send('no existen los archivos0');
            }
          }
        })
      }
      else {
        res.status(200).json({
          "msn" : "no encontro"
        })
      }
    }
  })
});

//servicio para elminar resolcion docnetes
router.get('/deleteResDOC/:id', async (req, res, next) => {
  let { id } = req.params;
  await Docente.deleteOne({_id: id });
  res.redirect('/MostrarRESdoc');
});

// servicio para mostrar resolucion docentes
router.get('/MostrarRESdoc', async (req, res) => {
  Docente.find({id_a : (idGlobalDocente)}).exec( async (erro, files) =>{
    if(erro){
      res.send(erro);
    }
    else{
      if(files != ""){


        res.render('insertarResolucionDoc',{
            idGlobalDocente,
            files,
            idPDF
        });
      }
      else {
        console.log(idGlobalDocente)
        res.render('insertarResolucionDoc',{
            idGlobalDocente,
            files,
            idPDF
        });
      }
    }
  })
});


/*router.post('/env', upload.any(), function (req, res, next){
  res.send(req.files);
});*/

// servicio para añadir pdf a resolcion docente
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post('/senddoc/:dc', async (req, res)=>{
const id = req.params;
 upload ( req,  res, async  (err) =>{
    if(err){
      res.send('err');
      return ;
    }
    else {
      //res.send('img');
      console.log(req.file);
      var ruta =  await req.file.path.substr(6, req.file.path.length);
      var archivo = {
      id_ref : id.dc,
      name : req.file.originalname,
      physicalpath : req.file.path,
      relativepath: "http://localhost:3000" + ruta
    };
    console.log(ruta);
    var pdfDato = new Pdf(archivo);
    await pdfDato.save();

      var files ={
      pdf : new Array(),
      rt : new Array()
    };
    await Docente.find({_id : id.dc}).exec( async(err, arc)=>{
    var pdf = arc[0].pdf;
    var aux = new Array();
    var con = new Array();
    console.log(pdf);
      if(pdf.length == 1 && pdf[0] ==""){
        await files.pdf.push("/senddoc/"+pdfDato._id);
        files.rt.push(archivo.relativepath);
      }
      else{
      await aux.push("/senddoc/"+pdfDato._id);
      con.push(archivo.relativepath);
      pdf= aux;
      rt= con;
      files.pdf = pdf;
      files.rt= rt;
    }
    await Docente.findOneAndReplace({_id : id.dc},files,(err, params) =>{
          if (err) {
                    res.status(500).json({
                      "msn" : "error en la actualizacion del pdf"
                    });
                    return;
                  }
                  else{
                    res.send('hola');
                    // res.redirect('/MostrarRESdoc');
                  }
            });
        })
    }
  })
});




router.post('/env/:univ', async (req, res)=>{
const id = req.params;
 upload ( req,  res, async  (err) =>{
    if(err){
      res.send('err');
      return ;
    }
    else {
      //res.send('img');
      console.log(req.file);
      var ruta = req.file.path.substr(6, req.file.path.length);
      var archivo = {
      id_ref : id.univ,
      name : req.file.originalname,
      physicalpath : req.file.path,
      relativepath: "http://localhost:3000" + ruta
    };
    var pdfDato = new Pdf(archivo);
    await pdfDato.save();

      var files ={
      pdf : new Array()
    };
    await Student.find({_id : id.univ}).exec( async(err, arc)=>{
    var pdf = arc.pdf;
    var aux = new Array();
    console.log(pdf);
      if(pdf.length == 1 && pdf[0] ==""){
        files.pdf.push("/env/"+pdfDato._id);
      }
      else{
      aux.push("/env/"+pdfDato._id);
      pdf= pdf.concat(aux);
      files.pdf = pdf;
    }
    await Student.findOneAndUpdate({_id : id.univ},files,(err, params) =>{
          if (err) {
                    res.status(500).json({
                      "msn" : "error en la actualizacion del pdf"
                    });
                    return;
                  }

                  return;
            });
        })
    }
  })
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><

router.get('/senddoc/:id', (res, req) =>{
  var idr= req.params;
  console.log(idr);
  Pdf.findOne({id_ref: id.dc}).exec((err, pdfs) =>{
    if(err){
      res.status(500).json({
        message : 'error'
      });
    }
    else{
      if(pdfs != ""){

        var file = fs.readFileSync('./verpdf'+pdfs.physicalpath);
        //var img = fs.readFileSync("./public/avatars/img.jpg");
        res.contentType('application/pdf');
        res.status(200).send(file);
      }
      else{
        res.status(424).json({
          "msn": "La solicitud falló, ,la imagen fue eliminada"
        });
        return;
      }
    }
  })
});
/*router.post('/env', async(req, res)=>{
var univ = {
  nombre :req.body.nombre,
  apellido : req.body.apellido
};
var uData = new Student(univ);
Student.find({nombre : req.body.nombre, apellido: req.body.apellido}, {"nombre" : 1}).exec( async (err, docs)=>{
console.log(docs);
  if(docs =! "")
  {
    upload (req, res, (err) =>{
      if(err){
        res.status(500).json({
            "msn" : "No se ha podido "
          });
      }
      else{
        res.send('img');
        console.log(req.file);
      }

    });
  }
  else{
    res.send("inserte un doc");
    await uData.save();
  }

})
});*/

//servicio para añadir a agrupar docente
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post('/addADoc', async (req, res)=>{
  const agr = {
    carrera : req.body.carrera,
    gestion : req.body.gestion,
    periodo : req.body.periodo
  };
  Agrupard.find({carrera: req.body.carrera, gestion: req.body.gestion, periodo: req.body.periodo}, {"_id" :1}).exec( (err, docs) => {
    if(err){
      res.send('error');
    }
    else{
      if(docs != ""){
        const resolid = docs;
           idGlobalDocente = docs[0]._id;
          Docente.find({id_a : (idGlobalDocente)}).exec( async(err, files)=>{
            if(err){
              res.send(err);
            }
            else{
              if(files != ""){
                res.redirect('MostrarRESdoc');
              }
              else {
                res.redirect('MostrarRESdoc');
              }
            }

          })
      }
      else {
        const agrupard = new Agrupard(agr);
        const race = agrupard.carrera;
        Career.findOne({carrera : race}).exec( async(error, dc) =>{
          if(error){
            res.status(200).json({
              "msn" : "errorrr "
            });
          }
          else {
            await agrupard.save();
            idGlobalDocente = agrupard._id;
            // idGlobalDocente = ida;
            console.log(idGlobalDocente);
            res.redirect('MostrarRESdoc')
            // res.status(200).json({
            //   "ida": agrupard._id,
            //   "msn":"creado"
            // })
          }
        })
      }
    }
  })
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
});

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
router.get('/form_paraEditarResDOC/:id', async (req, res) => {
  const { id } = req.params;
  const mostrar = await Docente.findById(id);
  res.render('editarRESdoc', {
    mostrar //esto es para enviar datos a la otra vista en este caso se envia el id
  });
});
//>>>>>>>>>>>>>>>
//este servicio sirve para actualizar datos de un formulario
router.post('/editRESdoc/:id', async (req, res) => {
  const { id } = req.params;
  await Docente.update({_id: id}, req.body);
  res.redirect('/MostrarRESdoc');
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
    res.redirect('/allGETres');
  });

});
//>>>>>>>>>>

router.post('/logeado', async (req, res) =>{
  Login.find({email:req.body.email, password:req.body.password}).exec( (err, docs)=> {
    console.log(docs);
    if(docs != ""){
      //res.render('mostrarResolucion');
      res.send('aqui estoy');
    }
    else{
      //res.render('index');
      res.send('no hay');
    }
  })
});
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

// servicio para mostrar todos los decentes que es el inicio
router.get("/allGETres", async(req, res) => {
  const RESdoc = await Docente.find();
  res.render('mostrarResolucion',{
    RESdoc
  });
});

//servicios para el estudiente
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// este servico es para mostrar grupo estudiantes
router.get('/gEST', async (req, res) => {
  res.render('grupoEstudiante');
});
//>>>>>>>>>>>>>>>>>>>>

// >>>>>>>>>>>>>>
var idGlobalEstudiante;
// servioco para añadir a agrupar estudiante
router.post('/ADDagEST', async (req, res)=>{
  const agr = {
    carrera : req.body.carrera,
    gestion : req.body.gestion,
    periodo : req.body.periodo,
    tipoBeca : req.body.tipoBeca
  };
  Agrupare.find({carrera: req.body.carrera, gestion: req.body.gestion, periodo: req.body.periodo, tipoBeca : req.body.tipoBeca}, {"_id" :1}).exec( (err, docs) => {
    if(err){
      res.send('error');
    }
    else{
      if(docs != ""){
        const resolid = docs;
           idGlobalEstudiante = docs[0]._id;
           console.log(idGlobalEstudiante + "   aqui >>>><<<<<<");
          Estudiantes.find({id_a : (idGlobalEstudiante)}).exec( async(err, files)=>{
            if(err){
              res.send(err);
            }
            else{
              if(files != ""){
                res.redirect('/MostrarRESest');
              }
              else {
                res.redirect('/MostrarRESest');
              }
            }

          })
      }
      else {
        const agrupard = new Agrupare(agr);
        const race = agrupard.carrera;
        Career.findOne({carrera : race}).exec( async(error, dc) =>{
          if(error){
            res.status(200).json({
              "msn" : "errorrr "
            });
          }
          else {
            await agrupard.save();
            idGlobalEstudiante = agrupard._id;
            // idGlobalDocente = ida;
            console.log(idGlobalEstudiante + " otro aqui");
            res.redirect('/MostrarRESest');
            // res.status(200).json({
            //   "ida": agrupard._id,
            //   "msn":"creado"
            // })
          }
        })
      }
    }
  })
});

// servicio para mostrar resolucion docentes
router.get('/MostrarRESest', async (req, res) => {
  Estudiantes.find({id_a : (idGlobalEstudiante)}).exec( async (erro, files) =>{
    if(erro){
      res.send(erro);
    }
    else{
      if(files != ""){
        res.render('insertarResolEst',{
            idGlobalEstudiante,
            files,
            idPDFest
        });
      }
      else {
        console.log(idGlobalDocente)
        res.render('insertarResolEst',{
            idGlobalEstudiante,
            files,
            idPDFest

        });
      }
    }
  })
});
// />>>>>>>>>>>>>>>>>>>>>>>>>>
var idPDFest;
//servicio para añadir resolucion a estudiante
router.post('/addResEst/:id', async (req, res) =>{
  const ida = req.params;
  const est = {
    numResolucion : req.body.numResolucion,
    numDictamen : req.body.numDictamen,
    obs : req.body.obs
  };
  const estudiente = new Estudiantes(est);
  Agrupare.find({_id : ida.id}).exec( async (err, docs) =>{
    if(err){
      res.send(err);
    }
    else {
      if(docs != ""){
         estudiente.id_a = ida.id;
         await estudiente.save();
        console.log(docs);
        //esto va a mostrar solo la resolcion insertada
        Estudiantes.findOne({id_a : (ida.id)}).exec( async (erro, files) =>{
          if(erro){
            res.send(erro);
          }
          else{
            if(files != ""){
              idPDFest = estudiente._id;
              console.log("Este es le id para el pdf:>) "+idPDFest+" (<: ");
            }
            else {
              res.send('no existen los archivos0');
            }
          }
        })
        Estudiantes.find({id_a : (ida.id)}).exec( async (erro, files) =>{
          if(erro){
            res.send(erro);
          }
          else{
            if(files != ""){
              idGlobalEstudiante = ida.id;
              res.redirect("/MostrarRESest");
            }
            else {
              res.send('no existen los archivos0');
            }
          }
        })
      }
      else {
        res.status(200).json({
          "msn" : "no encontro"
        })
      }
    }
  })
});
//servicio para elminar resolcion Estudiante
router.get('/deleteResEST/:id', async (req, res, next) => {
  let { id } = req.params;
  await Estudiantes.deleteOne({_id: id });
  res.redirect('/MostrarRESest');
});

//este servicio sirve para actualizar datos de un formulario
router.post('/editRESestt/:id', async (req, res) => {
  const { id } = req.params;
  await Estudiantes.update({_id: id}, req.body);
  res.redirect('/MostrarRESest');
});

// este servicio sirve para cambiar de pestaña recuperando el ID
router.get('/form_paraEditarResEST/:id', async (req, res) => {
  const { id } = req.params;
  const mostrar = await Estudiantes.findById(id);
  res.render('editarRESest', {
    mostrar //esto es para enviar datos a la otra vista en este caso se envia el id
  });
});
//>>>>>>>>>>>>>>>


module.exports = router;
