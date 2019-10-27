var connexion = require('../../config/db');
var moment = require('../../config/moment').moment;
var bodyparser = require('body-parser');


class categorie {

    constructor(row) {
        this.row = row;
    }


    static addCategorie(inputs, CallBack) {

        let sousCat = inputs.sousCats.split('æ');

        connexion.query("INSERT INTO categorie (nom) VALUES (?)", [inputs.categ], (err, result) => {
            if (err) {
                CallBack('error');
            } else {
                connexion.query("SELECT max(idCat) AS id from categorie", (err, result) => {
                    if (err) {
                        CallBack('error');
                    } else {
                        for (let i = 0; i < sousCat.length; i++) {
                            connexion.query("INSERT INTO souscategorie (nom, Categorie_idCat) VALUES (?,?)", [sousCat[i], result[0].id], (err, result) => {
                                if (err) {
                                    throw err;
                                } else {

                                }
                            })
                        }
                        CallBack('done')
                    }
                })
            }
        })
    }




    static selectategorie(CallBack) {
        connexion.query("SELECT categorie.idCat AS id ,categorie.nom AS nomCat, souscategorie.nom AS nomSousCat, souscategorie.idSousCat AS idSousCat FROM categorie LEFT JOIN souscategorie ON souscategorie.Categorie_idCat = categorie.idCat ORDER BY categorie.idCat DESC", funcEND);
        function funcEND(err1, rows, fields) {
            if (err1) throw err1;
            else {
                let cat = {};
                let categories = [];
                rows.forEach(function (row) {
                    let categorie = cat[row.id];
                    if (!categorie) {
                        categorie = {
                            idCat: row.id,
                            nomCat: row.nomCat,
                            sousCat: [],
                        };

                        cat[row.id] = categorie;
                        categories.push(categorie);
                    }

                    categorie.sousCat.push({
                        nomSousCat: row.nomSousCat,
                        idSousCa: row.idSousCat,
                    });
                });
                CallBack(categories);
            }
        }
    }


    static deletSousCat(inputs, CallBack) {
        connexion.query("DELETE FROM offre WHERE SousCategorie_idSousCat =?", [inputs.idSousCat], (err, result) => {
            if (err) {
                CallBack('error');
            } else {
                connexion.query("DELETE FROM souscategorie WHERE idSousCat =?", [inputs.idSousCat], (err, result) => {
                    if (err) {
                        CallBack('error');
                    } else {
                        CallBack('done')
                    }
                })
            }
        })
    }



    static deleteCategorie(inputs, CallBack) {
        connexion.query("DELETE FROM offre WHERE SousCategorie_idSousCat =?", [inputs.idCat], (err, result) => {
            if (err) {
                tCallBack('error');
            } else {
                connexion.query("DELETE FROM souscategorie WHERE Categorie_idCat =?", [inputs.idCat], (err, result) => {
                    if (err) {
                        CallBack('error');
                    } else {
                        connexion.query("DELETE FROM categorie WHERE idCat =?", [inputs.idCat], (err, result) => {
                            if (err) {
                                CallBack('error');
                            } else {
                                CallBack('done')
                            }
                        })
                    }
                })
            }
        })
    }



    static ModifierSousCat(inputs, CallBack) {
        let nom = inputs.nom.trim();
        connexion.query("UPDATE souscategorie SET nom = ?  WHERE (idSousCat = ?)", [nom, inputs.idSousCat], (err, result) => {
            if (err) {
                throw err;
            }
            else {
                CallBack('done')
            }
        })
    }


    static ModifierCat(inputs, CallBack) {
        let nom = inputs.nom.trim();
        connexion.query("UPDATE categorie SET nom = ?  WHERE (idCat = ?)", [nom, inputs.idCat], (err, result) => {
            if (err) {
                throw err;
            }
            else {
                CallBack('done')
            }
        })
    }



    static addSousCat(inputs, CallBack) {
        connexion.query("INSERT INTO souscategorie (nom,Categorie_idCat) VALUES (?,?)", [inputs.nom, inputs.idCat], (err, result) => {
            if (err) {
                throw err;
                // CallBack('error');
            } else {
                CallBack('done')
            }
        })
    }
}


module.exports = categorie;