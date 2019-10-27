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
router.get("/commandes-en-attente", redirectLogin, (request, response) => {
  let commande = require("../../models/Employe/commande");
  commande.selectCommande({ idEmp: 5, statut: "non faite" }, (resp) => {
    response.render('pages/Employe/commande/commandeAttente', { commandeAttente: resp });
  })
});

module.exports = router;




// app.post('/selectCommande', (request, response) => { 
//     let selectCommande = require("../models/Admin/commande");
//     selectCommande.selectCommande( (resp) => {
//         response.json(resp);
//     })
// })

// app.post('/addCategorie', (request, response) => { 
//     let addCategorie = require("../models/Admin/categorie");
//     addCategorie.addCategorie(request.body, (resp) => {
//         response.json(resp);
//     })
// })
