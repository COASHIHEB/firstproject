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
  response.render("pages/Employe/dashboardEmploye", {});
});

module.exports = router;
