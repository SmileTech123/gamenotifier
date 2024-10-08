var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fetch = require("node-fetch")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fs = require('fs');
var app = express();
const jsdom = require("jsdom");
const nodemailer = require('nodemailer');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get("/login", async function (req, res) {
  var user = req.query.user
  var pass = req.query.password
  var key = user + "-" + pass + ".json"
  let exist = fs.existsSync("settings/" + key)
  if (exist) {
    res.json({ error: false })
  } else {
    res.json({ error: true })
  }

})


app.get("/register", async function (req, res) {
  var user = req.query.user
  var pass = req.query.password
  var key = user + "-" + pass + ".json"
  console.log(key)
  let exist = fs.existsSync("settings/" + key)
  if (exist) {
    res.json({ error: true })
  } else {
    try {
      fs.writeFileSync("settings/" + key, JSON.stringify({ email: user, filter: '',active:true }))
      res.json({ error: false })
    } catch (error) {
      console.log(error)
      res.json({ error: true })
    }
  }

})


app.get("/settings", async function (req, res) {
  var user = req.query.user
  var pass = req.query.password
  var key = user + "-" + pass + ".json"
  let exist = fs.existsSync("settings/" + key)
  if (exist) {
    let sett = fs.readFileSync("settings/" + key, "utf-8")
    let jsonSett = JSON.parse(sett)
    res.json({ data: jsonSett, error: false })
  } else {
    res.json({ error: true })
  }

})

app.get("/writeSettings", async function (req, res) {
  var user = req.query.user
  var pass = req.query.password
  var filter = req.query.filter
  var active = req.query.active
  console.log(active)
  var key = user + "-" + pass + ".json"
  let exist = fs.existsSync("settings/" + key)
  if (exist) {
    fs.writeFileSync("settings/" + key, JSON.stringify({ email: user, filter: filter ,active:active}))
    res.json({ error: false })
  } else {
    res.json({ error: true })
  }

})

app.get("/files", async function (req, res) {
  var file = req.query.file
  let dir = fs.readdirSync("settings")

  if(file){
    let fileopen = fs.readFileSync("settings/"+file,"utf-8")
    res.send(fileopen);
  }else{
    res.send(dir);
  }
 
})


async function getTitle() {
  let dir = fs.readdirSync("settings")
  for (let d = 0; d < dir.length; d++) {
    const element = dir[d];
    let file = fs.readFileSync("settings/" + element, "utf-8")
    let jsonFile = JSON.parse(file)
    let emailActive = jsonFile.active==="true"
      if(emailActive){
        let email = jsonFile.email
        let filter = jsonFile.filter
        let filterList = filter.split(",")
        var resp = await fetch("https://www.skidrowreloaded.com/")
        resp = await resp.text()
        const dom = new jsdom.JSDOM(resp);
        let list = '<!DOCTYPE html><html lang="it"><head>    <meta charset="UTF-8">    <meta name="viewport" content="width=device-width, initial-scale=1.0">    <style>        body {            font-family: Arial, sans-serif;            margin: 0;            padding: 0;            background-color: #f4f4f4;        }        .email-container {            width: 100%;            max-width: 600px;            margin: 0 auto;            background-color: #333;            padding: 20px;            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);        }        .content-wrapper {            display: flex;            align-items: center;        }        .image-container img {            width: 150px;            height: auto;            border-radius: 5px;        }        .text-container {            margin-left: 20px;        }        .text-container h1 {            font-size: 24px;            color: f4f4f4;            margin-bottom: 10px;        }        .text-container a {            text-decoration: none;            background-color: #007BFF;            color: #f4f4f4;            padding: 10px 20px;            border-radius: 5px;            font-size: 16px;        }        h1{          color: white;        }    </style></head><body>    <div class="email-container">      <h1>Nuovi giochi aggiunti:</h1>   '
        let titleNew = dom.window.document.getElementsByClassName("post")[0].getElementsByTagName("a")[0].textContent
        var lastTitle = fs.readFileSync("lasttitle.txt","utf-8")
        var uploadEmail = false
        if (lastTitle !== titleNew) {
          fs.writeFileSync("lasttitle.txt",titleNew)
          for (let i = 0; i < dom.window.document.getElementsByClassName("post").length; i++) {
            const element = dom.window.document.getElementsByClassName("post")[i];
            let titolo = element.getElementsByTagName("a")[0].textContent
            let link = element.getElementsByTagName("a")[0].href
            let image = element.getElementsByTagName("img")[0].src
           
            let html =  '<div class="content-wrapper">            <!-- Immagine rettangolare verticale -->            <div class="image-container">                <img src="'+image+'" alt="Descrizione Immagine">            </div>            <!-- Testo e pulsante -->            <div class="text-container">                <h1>'+titolo+'</h1>                <a href="'+link+'" target="_blank">Visita la pagina</a>            </div>        </div>        <hr></hr>'
            if (filter !== "") {
    
              if (filterList.filter((f) => titolo.toLowerCase().includes(f.toLowerCase())).length > 0) {
                console.log(filterList.filter((f) => titolo.toLowerCase().includes(f.toLowerCase())), titolo)
                list = list + html
                uploadEmail=true
              }
            } else {
              list = list + html
              uploadEmail=true
            }
          }
    
          if (uploadEmail) {
            let transporter = nodemailer.createTransport({
              service: 'gmail', // Puoi usare altri servizi come Yahoo, Outlook, ecc.
              auth: {
                user: 'fabiogermana01@gmail.com', // Il tuo indirizzo email
                pass: 'dord vnir rzsl oydd' // La tua password o app-specific password se usi l'autenticazione a due fattori
              }
            });
            let mailOptions = {
              from: 'skidrowNotifier@skidrownotifier.com', // Il mittente
              to: email, // Destinatario
              subject: filter !== "" ? 'Notifica ultimi giochi ( FILTRI: ' + filter + ' )' : 'Notifica ultimi giochi',
              html: list + "</div></body></html>" // Corpo del messaggio
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log('Errore: ' + error);
              } else {
                console.log('Email inviata: ' + info.response);
              }
            });
          } else {
            console.log("Email non inviata");
          }
        }
      }

  }
}


getTitle()
setInterval(getTitle, 1800000);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
