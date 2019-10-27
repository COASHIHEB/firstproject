var connexion = require('../../config/db');
var moment = require('../../config/moment').moment;
let devis = require('../../config/devis');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyChnAfNPjSPo76qR3c9yR5IOWkA9BRlpf0'
});


class maps {


    //idEmpl statu=if(en service)
    // sum(durée commande) la dernier commande
    //durée + posision
    //min

    static getEmploye(CallBack) {
        connexion.query("SELECT * FROM utilisateur Inner join employe on WHERE statut = ? ORDER BY idUtil DESC", ['Administrateur'], (err, rows) => {
            if (err) throw err;
            let Admins = [];
            rows.forEach(function (row) {
                let admin = {
                    id: row.idAdmin,
                    pseudo: row.pseudo,
                    mail: row.email,
                    nom: row.nom,
                    prenom: row.prenom,
                    tel: row.numTel,
                    image: row.image,
                };
                Admins.push(admin);
            });
            CallBack(Admins);
        });
    }


}

module.exports = maps;