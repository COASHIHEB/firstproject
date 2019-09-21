var connexion = require('../../config/db');
var moment = require('../../config/moment');
var bodyparser = require('body-parser');


class categorie {

    constructor(row) {
        this.row = row;
    }


    static addCategorie(inputs, CallBack) {
        connexion.query("INSERT INTO categorie (nom) VALUES (?)", [inputs.categ], (err, result) => {
            if (err) {
                throw err;
            } else {
                connexion.query("SELECT max(idCat) AS id from categorie", (err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        for (let i = 0; i < inputs.sousCategorie.length; i++) {
                            connexion.query("INSERT INTO souscategorie (nom, Categorie_idCat) VALUES (?,?)", [inputs.sousCategorie[i], result[0].id], (err, result) => {
                                if (err) {
                                    throw err;
                                } else {
                                }
                            })
                        }
                    }
                })
            }
        })
    }

}

module.exports = categorie;