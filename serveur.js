var express = require("express");
var app = express(); //une déclaration et inistialisation du mosule Express
var bodyParser = require("body-parser");
var session = require("express-session");
var http = require("http").Server(app);


var datetime = require("./config/moment.js").dateTime;
console.log(datetime)


const fileUpload = require("express-fileupload");
app.use(fileUpload());

module.exports = { http };

/** Moteur de Tamplate **/

app.set("view engine", "ejs"); //déclarer une viex AngularJS

/** MidellWare **/

//app.use('/assets',express.static("public")) //pour protéger les fichier public
app.use(express.static("public"));

//partie bodyParser
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8100");
  res.header("Access-Control-Allow-Method", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.use(bodyParser.json());
//fin partie bodyParser

//Partie Session
app.use(
  session({
    secret: "retgerghr",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false
    }
  })
);




//Création d'un nouveau Midleware
app.use(require("./middlewares/flash"));
//Fin Partie session  !cookie: {secure: false} false car on utilise pas le protocole https
app.use(require("./routes/socket.js").router);


/** Nos Routes **/



app.get("/cart", (request, response) => {
  response.render("pages/Client/cart", {});
});

app.get("/contact", (request, response) => {
  response.render("pages/Client/contact", {

  });
});

app.get("/category", (request, response) => {
  response.render("pages/Client/category", {});
});

app.get("/checkout", (request, response) => {
  response.render("pages/Client/checkout", {});
});

// ####### coté admin #####
app.use(require("./routes/Admin/dashboardAdmin.js"));
app.use(require("./routes/Admin/stock.js"));
app.use(require("./routes/Admin/achat.js"));
app.use(require("./routes/Admin/employe.js"));
app.use(require("./routes/Admin/profile.js"));
app.use(require("./routes/Admin/offre.js"));
app.use(require("./routes/Admin/adherent.js"));
app.use(require("./routes/Admin/mail.js"));
app.use(require("./routes/Admin/categorie-sousCat.js"));
app.use(require("./routes/auth.js"));
app.use(require("./routes/messenger.js"));
app.use(require('./routes/Admin/commande.js'))
app.use(require('./routes/Admin/valise.js'))
app.use(require('./routes/Admin/client.js'))
app.use(require('./routes/Admin/configuration.js'))

// ####### coté employe #####
app.use(require("./routes/Employe/dashboardEmploye.js"));
app.use(require("./routes/Employe/commandeFaite.js"));
app.use(require("./routes/Employe/commandeAttente.js"));
app.use(require("./routes/Employe/valise.js"));
app.use(require("./routes/Employe/maps.js"));

// ####### coté client #####
app.use(require("./routes/Client/home.js"));
app.use(require('./routes/Client/panier.js'));
app.use(require('./routes/Client/commande.js'));
app.use(require('./routes/Client/produit.js'));
app.use(require('./routes/Ionic/images.js'));

// ####### Ionic #####


/** Fin Nos Routes **/

// Load requirements
var PORT = process.env.PORT || 8083;


http.listen(PORT, '0.0.0.0', function () {
  console.log("Server Started on port: " + PORT);
});
































// const serve = http.listen(8083);
// console.log("server is running on : localhost:8083");
