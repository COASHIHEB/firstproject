var connexion = require('../../config/db');
var moment = require('../../config/moment').moment;
var date = require('../../config/moment').date;

class achat {

    constructor(row) {
        this.row = row;
    }


    static addAchat(inputs, CallBack) {
        var queryCount = "SELECT COUNT(*) AS count FROM produit where nom = ? AND dateExp = ?";
        connexion.query(queryCount, [inputs.nom, inputs.dateExp], function (err, rows, fields) {
            if (err) throw err;
            var number = rows[0].count
            if (number) {
                var queryUpdate = "UPDATE produit SET quantiteReste = quantiteReste + ? WHERE nom = ? AND dateExp = ?";
                connexion.query(queryUpdate, [inputs.quantiteAchat, inputs.nom, inputs.dateExp], function (err, rows, fields) {
                    if (err) throw err;
                    var queryGetIdProduct = "SELECT idProd FROM produit where nom=? AND dateExp=? LIMIT 1"
                    connexion.query(queryGetIdProduct, [inputs.nom, inputs.dateExp], function (err, rows, fields) {
                        if (err) throw err;
                        var idProd = rows[0].idProd
                        var queryInsertAchat = "INSERT INTO achat (quantiteAchat, dateAchat, Produit_idProd) VALUES (?,?,?)";
                        connexion.query(queryInsertAchat, [inputs.quantiteAchat, date, idProd], function (err, rows, fields) {
                            if (err) CallBack('error');
                            else {
                                var insertedID = rows.insertId
                                CallBack({
                                    statut: 'done',
                                    idAchat: insertedID
                                });
                            }

                        });
                    });
                });
            } else {
                var queryInsertProduit = "INSERT INTO produit (nom, description, quantiteReste,dateExp,minQuantite) VALUES (?,?,?,?,?)";
                connexion.query(queryInsertProduit, [inputs.nom, inputs.description, inputs.quantiteAchat, inputs.dateExp, inputs.minQuantite], function (err, rows, fields) {
                    if (err) throw err;
                    var insertedID = rows.insertId
                    var queryInsertAchat = "INSERT INTO achat (quantiteAchat, dateAchat, Produit_idProd) VALUES (?,?,?)";
                    connexion.query(queryInsertAchat, [inputs.quantiteAchat, date, insertedID], function (err, rows, fields) {
                        if (err) CallBack('error');
                        else {
                            var insertedID = rows.insertId
                            CallBack({
                                statut: 'done',
                                idAchat: insertedID
                            });
                        }
                    });
                });
            }

        });


    }




    static allAchat(CallBack) {
        connexion.query("SELECT * FROM achat ,produit where achat.Produit_idProd=produit.idProd ORDER BY achat.idAchat DESC", [], (err, rows) => {
            if (err) throw err;
            let achats = [];
            rows.forEach(function (row) {
                let achat = {
                    idAchat: row.idAchat,
                    idProd: row.idProd,
                    nom: row.nom,
                    dateExp: moment(row.dateExp).format('YYYY-MM-DD'),
                    dateAchat: moment(row.dateAchat).format('YYYY-MM-DD'),
                    quantiteReste: row.quantiteReste,
                    minQuantite: row.minQuantite,
                    quantiteAchat: row.quantiteAchat,
                    description: row.description
                };
                achats.push(achat);
            });
            CallBack({
                statut: 'done',
                allAchat: achats
            });
        });
    }


    static recentAchat(CallBack) {
        connexion.query("SELECT * FROM achat ,produit where achat.Produit_idProd=produit.idProd ORDER BY achat.dateAchat DESC LIMIT 6", [], (err, rows) => {
            if (err) throw err;
            let achats = [];
            rows.forEach(function (row) {
                let achat = {
                    idAchat: row.idAchat,
                    nom: row.nom,
                    dateExp: moment(row.dateExp).format('YYYY-MM-DD'),
                    dateAchat: moment(row.dateAchat).format('YYYY-MM-DD'),
                    quantiteReste: row.quantiteReste,
                    minQuantite: row.minQuantite,
                    quantiteAchat: row.quantiteAchat,
                    description: row.description
                };
                achats.push(achat);
            });
            CallBack({
                statut: 'done',
                recentAchat: achats
            });
        });
    }





    static deleteAchat(inputs, CallBack) {
        connexion.query("DELETE FROM achat WHERE idAchat=?", [inputs.idAchat], (err, result) => {
            if (err) {
                CallBack('error');
            } else {
                CallBack('done');
            }
        });
    }


    static updateAchat(inputs, CallBack) {
        var query = "SELECT quantiteAchat FROM achat where idAchat = ?";
        connexion.query(query, [inputs.idAchat], function (err, rows, fields) {
            if (err) throw err;
            var oldQuantiteAchat = rows[0].quantiteAchat
            var queryUpdateProduit = "UPDATE produit SET quantiteReste = quantiteReste - ? WHERE idProd = ?";
            connexion.query(queryUpdateProduit, [oldQuantiteAchat, inputs.idProd], function (err, rows, fields) {
                if (err) throw err;
                var queryUpdateAchat = "UPDATE achat SET quantiteAchat = ? , dateAchat = ? WHERE idAchat = ?";
                connexion.query(queryUpdateAchat, [inputs.quantiteAchat, inputs.dateAchat, inputs.idAchat], function (err, rows, fields) {
                    if (err) throw err;
                    var queryCount = "SELECT COUNT(*) AS count FROM produit where nom = ? AND dateExp = ?";
                    connexion.query(queryCount, [inputs.nom, inputs.dateExp], function (err, rows, fields) {
                        if (err) throw err;
                        var number = rows[0].count
                        if (number) {
                            var queryUpdate = "UPDATE produit SET quantiteReste = quantiteReste + ? WHERE nom = ? AND dateExp = ?";
                            connexion.query(queryUpdate, [inputs.quantiteAchat, inputs.nom, inputs.dateExp], function (err, rows, fields) {
                                if (err) throw err;
                                CallBack('done')
                            });
                        } else {
                            var queryMinQuantite = "SELECT minQuantite FROM produit WHERE idProd =?"
                            connexion.query(queryMinQuantite, [inputs.idProd], function (err, rows, fields) {
                                if (err) throw err;
                                var minQuantite = rows[0].minQuantite
                                var queryInsertProduit = "INSERT INTO produit (nom, description, quantiteReste,dateExp,minQuantite) VALUES (?,?,?,?,?)";
                                connexion.query(queryInsertProduit, [inputs.nom, inputs.description, inputs.quantiteAchat, inputs.dateExp, minQuantite], function (err, rows, fields) {
                                    if (err) throw err;
                                    var insertedID = rows.insertId
                                    var queryUpdateAchat = "UPDATE achat SET Produit_idProd = ? WHERE idAchat = ?";
                                    connexion.query(queryUpdateAchat, [insertedID, inputs.idAchat], function (err, rows, fields) {
                                        if (err) throw err;
                                        CallBack('done')

                                    });

                                });

                            });

                        }

                    });
                });
            });



        });

    }
}

module.exports = achat;