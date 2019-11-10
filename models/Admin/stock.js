var connexion = require('../../config/db');
var moment = require('../../config/moment').moment;
var date = require('../../config/moment').date;


class Stock {

    constructor(row) {
        this.row = row;
    }


    static allStock(CallBack) {
        connexion.query("SELECT * FROM produit ORDER BY idProd DESC", [], (err, rows) => {
            if (err) throw err;
            let produits = [];
            rows.forEach(function (row) {
                let prod = {
                    idProd: row.idProd,
                    nom: row.nom,
                    dateExp: moment(row.dateExp).format('YYYY-MM-DD'),
                    description: row.description,
                    quantiteReste: row.quantiteReste,
                    minQuantite: row.minQuantite
                };
                produits.push(prod);
            });
            CallBack(produits);
        });
    }
    static stockBientotExpire(CallBack) {
        connexion.query("SELECT * FROM produit where dateExp <= ? ORDER BY idProd DESC ", [date], (err, rows) => {
            if (err) throw err;
            let produits = [];
            rows.forEach(function (row) {
                let prod = {
                    idProd: row.idProd,
                    nom: row.nom,
                    dateExp: moment(row.dateExp).format('YYYY-MM-DD'),
                    description: row.description,
                    quantiteReste: row.quantiteReste,
                    minQuantite: row.minQuantite
                };
                produits.push(prod);
            });
            CallBack(produits);
        });
    }


    static stockMinimum(CallBack) {
        connexion.query("SELECT * FROM produit where quantiteReste <= minQuantite ORDER BY idProd DESC ", [], (err, rows) => {
            if (err) throw err;
            let produits = [];
            rows.forEach(function (row) {
                let prod = {
                    idProd: row.idProd,
                    nom: row.nom,
                    dateExp: moment(row.dateExp).format('YYYY-MM-DD'),
                    description: row.description,
                    quantiteReste: row.quantiteReste,
                    minQuantite: row.minQuantite
                };
                produits.push(prod);
            });
            CallBack(produits);
        });
    }


    static deleteStock(inputs, CallBack) {
        connexion.query("delete from produit where idProd = ? ", [inputs.idutilisateur], funcEnd);

        function funcEnd(err, results) {
            if (err) {
                CallBack('error');
            } else {
                CallBack('done');
            }
        }
    }

    static updateStock(inputs, CallBack) {
        connexion.query('UPDATE produit SET nom=? , description=? ,quantiteReste = ?, dateExp =?, minQuantite = ? where idProd=?', [inputs.nom, inputs.description, inputs.quantiteReste, inputs.dateExp, inputs.minQuantite, inputs.idProd], funcEnd);

        function funcEnd(err, rows) {
            if (err) {
                throw err
            } else {
                CallBack('done');

            }
        }
    }


}

module.exports = Stock;