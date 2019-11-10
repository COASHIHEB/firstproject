var express = require("express");
var app = express();
var router = express.Router();

/**** Redirect l'utilisateur no connecter  vert la page login ****/
const redirectLogin = (request, response, next) => {
  if (!request.session.userType) {
    response.redirect("/login");
  } else {
    if (request.session.userType === "Employe") {
      next();
    } else if (request.session.userType === "Administrateur") {
      response.redirect("/dashboard-admin");
    } else {
      response.redirect("/");
    }
  }
};

/* lien vert la pages idex d'admenistrateur */
router.get("/dashboard-employe", redirectLogin, (request, response) => {
  let select = require("../../models/Employe/dashboard.js");
  select.selectCommande(request.session.userId, (resp) => {
    console.log(resp)
    commande = resp;
    response.render("pages/Employe/dashboardEmploye", { commande: commande });
  })
});

module.exports = router;
// app.get('/client', (request, response) => {
//   let select = require("../models/Admin/client");
//   select.selectClientCF((resp)=>{
//       clientF = resp;
//       select.selectClientCNF((resp)=>{
//           clientNF = resp;
//           select.selectClient((resp)=>{
//               client = resp;
//               response.render('pages/Admin/client/client', {clientF :clientF, clientNF: clientNF, client:client});
//           })
//       })
//   })
// })