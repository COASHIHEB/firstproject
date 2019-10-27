var express = require("express");
var app = express();
var router = express.Router();

/**** Redirect l'admin no connecter  vert la page login ****/
const redirectLogin = (request, response, next) => {
  if (!request.session.userType) {
    response.redirect("/login");
  } else {
    if (request.session.userType === "Administrateur") {
      next();
    } else if (request.session.userType === "Employe") {
      return response.redirect('/dashboard-employe');
    } else {
      return response.redirect('/');
    }
  }
};

/* lien vert la pages idex d'admenistrateur */
router.get("/dashboard-admin", redirectLogin, (request, response) => {
  require("../../models/Admin/mail").getMails(resp => {
    response.render("pages/Admin/dashboardAdmin", { mails: resp });
  });
});



// leilaguerr2o@gmail.com
//leilaleila

module.exports = router;
