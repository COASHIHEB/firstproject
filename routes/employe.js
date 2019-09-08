var express = require('express');
var app = express.Router();



/* lien vers page employe */
app.get('/employe', (request, response) => {
    let selectEmploye = require("../models/Admin/employe");
    selectEmploye.selectEmploye((resp) => {
        let resultSelect = resp;
        selectEmploye.selectAdmin((resp) => {
            let resultSelectAdmin = resp;
            response.render('pages/Admin/employe/employe', {
                respo: resultSelect,
                respoAdmin: resultSelectAdmin
            });
        });
    });
});


/* Ajouter supprimé modifier et selectionner utilisateur */
app.post('/addUser', (request, response) => {
    let addUser = require("../models/Admin/employe");
    addUser.addUser(request.body, (resp) => {
        response.json(resp);
    })
})

app.post('/selectEmploye', (request, response) => {
    let selectEmploye = require("../models/Admin/employe");
    selectEmploye.selectEmploye((resp) => {
        response.json(resp);
    });
})

app.post('/deleteEmp', (request, response) => {
    let deleteEmp = require("../models/Admin/employe");
    deleteEmp.deleteEmp(request.body, (resp) => {
        response.json(resp);
    })
})

app.post('/modifierEmp', (request, response) => {
    let modifierEmp = require("../models/Admin/employe");
    modifierEmp.modifierEmp(request.body, (resp) => {
        response.json(resp);
    })
})

/*fin Ajouter supprimé modifier et selectionner utilisateur */
module.exports = app