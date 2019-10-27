var express = require('express');
var bodyParser = require('body-parser');
var app = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/client', (request, response) => {
    let select = require("../models/Admin/client");
    select.selectClientCF((resp)=>{
        clientF = resp;
        select.selectClientCNF((resp)=>{
            clientNF = resp;
            select.selectClient((resp)=>{
                client = resp;
                response.render('pages/Admin/client/client', {clientF :clientF, clientNF: clientNF, client:client});
            })
        })
    })
})



module.exports = app
