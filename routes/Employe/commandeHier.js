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
router.get("/commandes-hier", redirectLogin, (request, response) => {
  let commande = require("../../models/Employe/commandeHier");
  commande.selectCommande((resp) => {
    response.render('pages/Employe/commande/commandeHier', { commandeHier: resp });
  })
});






module.exports = router;