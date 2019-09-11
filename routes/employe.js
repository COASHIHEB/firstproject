var express = require('express');
var app = express.Router();


/**** Redirect l'utilisateur no connecter  vert la page login ****/
const redirectLogin = (request, response, next) => {
    if (!request.session.userType) {
        response.redirect('/login');
    } else {
        if (request.session.userType === "Administrateur") {
            next();
        } else if (request.session.userType === "employe") {
            response.redirect('/home');
        } else {
            response.redirect('/');
        }
    }
}


/* lien vers page employe */
app.get('/employe', redirectLogin, (request, response) => {
    require("../models/Admin/employe").selectEmploye((resp) => {
        require("../models/Admin/employe").selectAdmin((res) => {
            response.render('pages/Admin/employe/employe', {
                respo: resp,
                respoAdmin: res
            });
        });
    });
});


/* Ajouter supprimé modifier et selectionner utilisateur */
app.post('/addUser', (request, response) => {
    require("../models/Admin/employe").addUser(request.body, (resp) => {
        response.json(resp);
    })
})

app.post('/selectEmploye', (request, response) => {
    require("../models/Admin/employe").selectEmploye((resp) => {
        response.json(resp);
    });
})

app.post('/deleteEmp', (request, response) => {
    require("../models/Admin/employe").deleteEmp(request.body, (resp) => {
        response.json(resp);
    })
})

app.post('/modifierEmp', (request, response) => {
    require("../models/Admin/employe").modifierEmp(request.body, (resp) => {
        response.json(resp);
    })
})

/*fin Ajouter supprimé modifier et selectionner utilisateur */
module.exports = app