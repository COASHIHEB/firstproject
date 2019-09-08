var connexion = require('../../config/db');

class achat {

    constructor(row) {
        this.row = row;
    }







    static getProfile(CallBack) {
        connexion.query("SELECT * FROM administrateur  where idAdmin=?", [], (err, rows) => {
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
            CallBack(achats);
        });
    }


}

module.exports = achat;