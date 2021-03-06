const express = require('express');
const router = express.Router();
const multer = require('multer');
//const upload = multer({dest: 'src/documentos/'})
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
var util = require('util')

//aljand
const Estudiantes = require('../models/estudiantes');
const Login = require('../models/login');
const Data = require('../models/data');
//>>>>>>>>>>>>>>>>>>>
const Career = require('../models/career');
const Facultad = require('../models/faculty');
const bodyParser = require('body-parser');
const Agrupare = require('../models/agruparestudiante');
const Agrupard = require('../models/agrupardocente');
const Docente = require('../models/ResolucionDocente');

const Student = require('../models/CartaEstudiante');
const Teacher = require('../models/CartaDocente');

const Pdf = require('../models/pdf');

//global validator
var files;
var idPDF;
var grupo;
var idFACULTAD;
var idGlobalDocent;

const storage = multer.diskStorage({
  destination: 'src/public/documents',
  filename: function (req, file, cb) {
    console.log("-------------------------");
      console.log(file);
    //cb(null, file.originalname + "-" +  Date.now() );
    cb(null, file.fielname + '-' +  Date.now()+ '.pdf' );
  }
});
const upload = multer({
  storage : storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file,cb);
  }
}).single('doc');
//revisar el tipo de archivos
function checkFileType(file, cb){
  //solo la ext
    const filetypes= /pdf|txt/;
  //revisar la exte
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //revisar mime
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
      return cb(null, true);
    }
    else{
      cb('Error: pdf only');
    }
  }
router.get('/verpdf/id:', async(req, res) =>{
res.render('verPdf', { title: 'Aqui' });
});

router.get('/VERRpdf', async (req, res) => {

  res.render('enviarPDF');
});


router.get('/', async (req, res) => {
  const user = await Login.find();
  res.render('index',{
    user,
  });
});

router.post('/add', async (req, res) =>{
const student = new Student(req.body);
await student.save();
console.log(student);
res.redirect('/');
//res.send('received');
});

//servicios crud para facultad
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<
// este servicio sirve para a insertar a faultad
router.post('/addf', async (req, res) =>{
const facultad = new Facultad(req.body);
await facultad.save();
console.log(facultad);
res.redirect('/facultad');
});
//>>>>>>>>><<>><<<>>><<<<<<<>><<>>>><<<<<>>>><<<<>>>><<<<><<<<<<<<><<<>><

// este servicio sirve para cambiar de pestaña recuperando el ID
router.get('/editFacultad/:id', async (req, res) => {
  const { id } = req.params;
  const mostrar = await Facultad.findById(id);
  res.render('WformFACUedit', {
    mostrar //esto es para enviar datos a la otra vista en este caso se envia el id
  });
});

//este servicio sirve para actualizar datos de un carta estudiante
router.post('/editFacu/:id', async (req, res) => {
  const { id } = req.params;
  await Facultad.update({_id: id}, req.body);
  res.redirect('/facultad');
});
//<>>>>>><>><>>><<>>><>><<<<><<<>><><<<>><<<><<<<><<<<<<>><<<>><><<<<<
// servico para eliminar facultad
router.get('/deletFacu/:id', async (req, res, next) => {
  let { id } = req.params;
  await Facultad.deleteOne({_id: id });
  res.redirect('/facultad');
});
//<<>><<<><<><<<>><<<><<>>><<<<<<><<<<>>><<<><<<>>>><<<<>><<<<><<<>>><<<
// servico para mostrar vista Wfacultad
router.get('/facultad', async (req, res) => {
  const facuT = await Facultad.find();
  res.render('Wfacultad',{
    facuT
  });
});
//>>>>>>>>>>>><<<>>><<<>>><<><<<<>><<>>><>>><<<><<<<<<>>><<<<>>>><<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<>>>>><<<<><<<<<><>>><<>>><>><<<<><
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// este servicio sirve para cambiar de pestaña recuperando el ID
router.get('/insertcarrera/:id', async (req, res) => {
  const idfacu = req.params;
  idFACULTAD = idfacu.id;
  console.log(idFACULTAD);
  res.redirect('/mostrarCarrera');
});
//>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>><<<<<>>>><<<<>>><<<>><<>><<<<<<<<<<

// servicio para mostrar carreras
router.get('/mostrarCarrera', async (req, res) => {
  Career.find({id_f : (idFACULTAD)}).exec( async (erro, files) =>{
    if(erro){
      res.send(erro);
    }
    else{
      if(files != ""){
        res.render('WinsertarCarrera',{
            idFACULTAD,
            files
        });
      }
      else {
        //console.log(idGlobalDocente)
        res.render('WinsertarCarrera',{
            idFACULTAD,
            files
        });
      }
    }
  })
});

//servicio para añadir a carrera con id de la facultad
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
res.redirect('/mostrarCarrera');

});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// este servicio sirve para cambiar de pestaña recuperando el ID
router.get('/editCarrera/:id', async (req, res) => {
  const { id } = req.params;
  const mostrar = await Career.findById(id);
  res.render('WeditCarrera', {
    mostrar //esto es para enviar datos a la otra vista en este caso se envia el id
  });
});

//este servicio sirve para actualizar datos de un carta estudiante
router.post('/editC/:id', async (req, res) => {
  const { id } = req.params;
  await Career.update({_id: id}, req.body);
  res.redirect('/mostrarCarrera');
});
//<>>>>>><>><>>><<>>><>><<<<><<<>><><<<>><<<><<<<><<<<<<>><<<>><><<<<<
// servico para eliminar carrera
router.get('/deleteCarrera/:id', async (req, res, next) => {
  let { id } = req.params;
  await Career.deleteOne({_id: id });
  res.redirect('/mostrarCarrera');
});
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
router.get('/viewsteacher', (req, res) =>{

  res.render('insertarResolucionDoc',{
      idGlobalDocente,
      files,
      idPDF,
      grupo
  });
});
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
            idPDF,
            grupo
        });
      }
      else {
        console.log(idGlobalDocente)
        res.render('insertarResolucionDoc',{
            idGlobalDocente,
            files,
            idPDF,
            grupo
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

router.post('/senddoc/:dc',  (req, res)=>{
const id = req.params;
 upload ( req,  res, (err) =>{
    if(err){
      res.render({
        msg : err
      });
    }
    else {
      //res.send('img');
      //if(req.file == undefined){
        //res.redirect('/MostrarRESdoc');
      //}
      //else{
        //console.log(req.file);
        console.log("este archivo es"+ __filename);
        console.log("esta ubicado en"+ __dirname);

        //res.redirect('/viewsteacher');
        const archivo ={
          id_ref : id.dc,
          name : req.file.filename,
          physicalpath : req.file.path,
          relativepath : ""
        };
        pdfDato = new Pdf(archivo);
        pdfDato.save().then((infofile) => {
          var file ={pdfs :new Array()};

        Docente.findOne({ _id : (id.dc)}).exec ( ( err, agr)=>{
          if(err){
            //res.render('enviarPDF');
            res.render('insertarResolucionDoc');
            console.log(err);
          }
          else {
            if(agr != null){
              const pdf = agr.pdf;
              const aux = new Array();
              if(pdf.length == 1 && pdf[0] == ""){
                file.pdfs.push("/senddoc/"+infofile._id);

              }
              else{
                file.pdfs.push("/senddoc/"+infofile._id);
              }
              Docente.findOneAndUpdate({_id: (id.dc)},file, (err, params)=>{
                if (err) {
                  console.log(err);
                }
                console.log(req.file);
                res.redirect('/MostrarRESdoc');
                //res.redirect('/VERRpdf');

              });
            }
            else {
              //res.redirect('/VERRpdf');
              res.redirect('/MostrarRESdoc');

            }
          }

        })
      });
    //  }
    }
  })
});


router.post('/sendteacher/:dc',  (req, res)=>{
const id = req.params.dc;
 upload ( req,  res, (err) =>{
    if(err){
      res.render({
        msg : err
      });
    }
    else {
      //res.send('img');
      //if(req.file == undefined){
        //res.redirect('/MostrarRESdoc');
      //}
      //else{
        //console.log(req.file);
        console.log("este archivo es"+ __filename);
        console.log("esta ubicado en"+ __dirname);
        var ruta = req.file.path.substr(6, req.file.path.length);
        console.log("--->"+ruta);
        //res.redirect('/viewsteacher');
        const archivo ={
          id_ref : id.dc,
          name : req.file.filename,
          physicalpath : req.file.path,
          relativepath : "https://localhost:3000"+ruta
        };
        pdfDato = new Pdf(archivo);
        pdfDato.save().then((infofile) => {
          var file ={pdfs :new Array()};

        Teacher.find({ _id : id}).exec ( ( err, agr)=>{
          if(err){
            //res.render('enviarPDF');
            res.render('error');
            console.log(err);
          }
          else {

            if(agr != null){
              const pdf = agr.pdf;
              const aux = new Array();
              if(pdf.length == 1 && pdf[0] == ""){
                file.pdfs.push("/sendteacher/"+infofile._id);

              }
              else{
                aux.push("/sendteacher/"+infofile._id);
                pdf= pdf.concat(aux);
                file.pdfs = pdf;
              }
              Teacher.findOneAndUpdate({_id: id},file, (err, params)=>{
                if (err) {
                  res.render('error');
                }
                console.log(req.file);
                res.redirect('/MostrarCARTAdoc');
                //res.redirect('/VERRpdf');

              });
            }
            else {
              //res.redirect('/VERRpdf');
              res.redirect('/MostrarCARTAdoc');

            }
          }

        })
      });
    //  }
    }
  })
});

router.get('/getteacher/', (req, res)=>{
  var data = req.query;
  Pdf.find({_id:data.id}).exec(function(err, docs) {
    if(err)
    {
      res.render('error');
    }
    else {
      if(docs != ""){
        var name = docs.physicalpath.split("/")[2];
        //res.redirect("http://localhost:3000/documents/"+name);
        res.send("http://localhost:3000/documents/"+name);
      }
      else{
        res.send("there isn't");
      }
    }
  });
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

router.get('/archivo/:id', (res, req) =>{
  const idr = req.params;
  console.log(idr);
  Pdf.findOne({_id: (idr.id)}).exec((err, pdfs) =>{
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
   grupo = new Agrupard(agr);
  Agrupard.find({carrera: req.body.carrera, gestion: req.body.gestion, periodo: req.body.periodo}, {"_id" :1}).exec( (err, docs) => {
    if(err){
      res.send('error');
    }
    else{
      if(docs != ""){
        const resolid = docs;
           console.log(grupo);
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

router.get('/filtroRE', async(req, res) =>{
  const idg = req.query;
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


router.get('/filtroRD/', async(req, res) =>{
  const idg = req.query;
  Docente.find({id_a : (idg.id)}).exec( (err, docs) =>{
    if(docs){
      res.status(200).json({
        info:  docs
        //aqui la ventana donde se muestra
       });
    }
    else {
      res.status(201).json({
          "msn" : "no existen "
        });
    }
  })
});

router.get('/filtroGD/', async(req, res) =>{
  const params = req.query;
  console.log(req.query);

  //  const tipo = params.tipo;
  //db.prueba.find({ $text : { $search: '"Miguel Quijote"'} });
  Agrupard.find({carrera : params.carrera, gestion : params.year, periodo : params.periodo  }).exec( (err, docs) =>{
  if (docs != ""){
    const  idg  = docs;
    console.log(idg);
    res.status(200).json({
      info:  docs
//aqui la ventana
     });
     //res.redirect('/filtroRD/?'+docs._id);
  }
  else{
    res.status(201).json({
        "msn" : "no existe "
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
  const carrera = await Career.find();
  // console.log(carrera);
  res.render('grupoDocentes',{
    carrera
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
  const carrera = await Career.find();
  res.render('grupoEstudiante',{
    carrera
  });
});
//>>>>>>>>>>>>>>>>>>>>

// >>>>>>>>>>>>>>
var idGlobalEstudiante;
var grupoEST;
// servioco para añadir a agrupar estudiante
router.post('/ADDagEST', async (req, res)=>{
  const agr = {
    carrera : req.body.carrera,
    gestion : req.body.gestion,
    periodo : req.body.periodo,
    tipoBeca : req.body.tipoBeca
  };
  grupoEST = new Agrupare(agr);
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
            idPDFest,
            grupoEST
        });
      }
      else {
        console.log(idGlobalDocente)
        res.render('insertarResolEst',{
            idGlobalEstudiante,
            files,
            idPDFest,
            grupoEST
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


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var pdfT;
var idGlobalTeach;

// este servicio sirve para cambiar de pestaña recuperando el ID
router.get('/formCDoc/:id', async (req, res) => {
  const idT = req.params;
  idGlobalTeach = idT.id;
  console.log(idGlobalTeach);
  res.redirect('/MostrarCARTAdoc');
});
//servicio para añdir a cartas docente
router.post('/addCartasDoc/:id', async (req, res) =>{
  const ida = req.params;
  const dc = {
    nombre : req.body.nombre,
    apellido : req.body.apellido,
    pdf : "",
    obs : req.body.obs
  };
  const teacher = new Teacher(dc);
  Docente.find({_id : ida.id}).exec( async (err, docs) =>{
    if(err){
      res.render('error');
    }
    else {
      if(docs != ""){
         teacher.id_ResDoc = ida.id;
         await teacher.save();
        console.log(docs);
        //esto va a mostrar solo la resolcion insertada
        Teacher.findOne({id_ResDoc : (ida.id)}).exec( async (erro, files) =>{
          if(erro){
            res.send(erro);
          }
          else{
            if(files != ""){
              pdfT = teacher._id;//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
              console.log("Este es le id para el pdf:>) "+pdfT+" (<: ");
            }
            else {
              res.send('no existen los archivos0');
            }
          }
        })
        Teacher.find({id_ResDoc : (ida.id)}).exec( async (erro, files) =>{
          if(erro){
            res.send(erro);
          }
          else{
            if(files != ""){
              idGlobalTeach = ida.id;
              res.redirect("/MostrarCARTAdoc");
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

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>/
//>>>>>>>>>>>>>>>>>>>
// servicio para mostrar cartas docentes
router.get('/MostrarCARTAdoc', async (req, res) => {
  Teacher.find({id_ResDoc : (idGlobalTeach)}).exec( async (erro, files) =>{
    if(erro){
      res.send(erro);
    }
    else{
      if(files != ""){
        res.render('cartasDocentes',{
            idGlobalTeach,
            files,
            pdfT
        });
      }
      else {
        //console.log(idGlobalDocente)
        res.render('cartasDocentes',{
            idGlobalTeach,
            files,
            pdfT

        });
      }
    }
  })
});

// servico para eliminar carta docentes
router.get('/deleteCartaDOC/:id', async (req, res, next) => {
  let { id } = req.params;
  await Teacher.deleteOne({_id: id });
  res.redirect('/MostrarCARTAdoc');
});

// este servicio sirve para cambiar de pestaña recuperando el ID
router.get('/formEditCartaDOC/:id', async (req, res) => {
  const { id } = req.params;
  const mostrar = await Teacher.findById(id);
  res.render('editarCartaDOC', {
    mostrar //esto es para enviar datos a la otra vista en este caso se envia el id
  });
});

//este servicio sirve para actualizar datos de un carta docente
router.post('/editCartDOC/:id', async (req, res) => {
  const { id } = req.params;
  await Teacher.update({_id: id}, req.body);
  res.redirect('/MostrarCARTAdoc');
});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------------
var idGlobalEST;
var pdfEST;
// este servicio sirve para cambiar de pestaña recuperando el ID
router.get('/formCEst/:id', async (req, res) => {
  const idEST = req.params;
  idGlobalEST = idEST.id;
  console.log(idGlobalEST);
  res.redirect('/MostrarCARTAest');
});

//servicio para añdir a form carta Estudiante
router.post('/addCartasEST/:id', async (req, res) =>{
  const ida = req.params;
  const dc = {
    nombre : req.body.nombre,
    apellido : req.body.apellido,
    pdf : "",
    obs : req.body.obs
  };
  const student = new Student(dc);
  Estudiantes.find({_id : ida.id}).exec( async (err, docs) =>{
    if(err){
      res.send(err);
    }
    else {
      if(docs != ""){
         student.id_ResEst = ida.id;
         await student.save();
        console.log(docs);
        //esto va a mostrar solo la resolcion insertada
        Student.findOne({id_ResEst : (ida.id)}).exec( async (erro, files) =>{
          if(erro){
            res.send(erro);
          }
          else{
            if(files != ""){
              pdfT = student._id;//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
              console.log("Este es le id para el pdf:>) "+pdfT+" (<: ");
            }
            else {
              res.send('no existen los archivos0');
            }
          }
        })
        Student.find({id_ResEst : (ida.id)}).exec( async (erro, files) =>{
          if(erro){
            res.send(erro);
          }
          else{
            if(files != ""){
              idGlobalEST = ida.id;
              res.redirect("/MostrarCARTAest");
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

// servicio para mostrar cartas Estudiante
router.get('/MostrarCARTAest', async (req, res) => {
  Student.find({id_ResEst : (idGlobalEST)}).exec( async (erro, files) =>{
    if(erro){
      res.send(erro);
    }
    else{
      if(files != ""){
        res.render('cartaEStudiante',{
            idGlobalEST,
            files,
            pdfEST
        });
      }
      else {
        //console.log(idGlobalDocente)
        res.render('cartaEStudiante',{
            idGlobalEST,
            files,
            pdfEST

        });
      }
    }
  })
});

// servico para eliminar carta estudiantes
router.get('/deleteCartaEST/:id', async (req, res, next) => {
  let { id } = req.params;
  await Student.deleteOne({_id: id });
  res.redirect('/MostrarCARTAest');
});

// este servicio sirve para cambiar de pestaña recuperando el ID
router.get('/formEditCartaEST/:id', async (req, res) => {
  const { id } = req.params;
  const mostrar = await Student.findById(id);
  res.render('editarCartaEST', {
    mostrar //esto es para enviar datos a la otra vista en este caso se envia el id
  });
});

//este servicio sirve para actualizar datos de un carta estudiante
router.post('/editCartESTudentd/:id', async (req, res) => {
  const { id } = req.params;
  await Student.update({_id: id}, req.body);
  res.redirect('/MostrarCARTAest');
});
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
module.exports = router;
