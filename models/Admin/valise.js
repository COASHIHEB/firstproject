var connexion = require('../../config/db');
var moment = require('../../config/moment').moment;


class Stock {

    constructor(row) {
        this.row = row;
    }


    static selectProd(CallBack) {
        connexion.query("SELECT * FROM produit WHERE quantiteReste > 0 ORDER BY idProd DESC", [], (err, rows) => {
            if (err) throw err;
            let produits = [];
            rows.forEach(function (row) {
                let prod = {
                    idProd: row.idProd,
                    nom: row.nom,
                    quantiteReste: row.quantiteReste,
                };
                produits.push(prod);
            });
            CallBack(produits);
        });
    }



    static addValise(inputs, CallBack){ 
        let produit = inputs.produit.split('æ');
        let employes = [];
            for(let j=0; j<produit.length; j++ ){
                connexion.query("SELECT idProd AS id from produit WHERE nom = ?",[produit[j]], (err, result)=>{
                    if(err) {
                        CallBack('error');
                    }else { 
                        let idProduit = result[0].id;
                        connexion.query("SELECT idEmp AS id from employe ", (err, rows)=>{
                            if(err) {
                                CallBack('error');
                            }else { 
                                rows.forEach(function (row) {
                                    let employe = {
                                        idEmp: row.id,
                                    };
                                    employes.push(employe);
                                });
                                for(let i=0; i<employes.length; i++){
                                    connexion.query("INSERT INTO valise (quantite, pris, id_produit, id_employe) VALUES (?,?,?,?)", [0 ,"oui", idProduit,employes[i].idEmp], (err, result)=>{
                                        if(err) {
                                            CallBack('error');
                                        }else{
                                        }
                                    })
                                }
                                employes = [];
                            }
                        })
                    }
                })
            }
            CallBack('done')
        }
    
    


        static selectValise(CallBack) {
            connexion.query("SELECT employe.idEmp, valise.quantite, utilisateur.nom , utilisateur.prenom, produit.nom AS produit, produit.idProd AS idProd FROM employe LEFT JOIN utilisateur ON utilisateur.idUtil= employe.utilisateur_idUtil LEFT JOIN valise ON valise.id_employe = employe.idEmp  LEFT JOIN produit ON valise.id_produit = produit.idProd  ", [], (err, rows) => {
                if (err) throw err;
                else{
                    let notificationMap = {};
                    let notifications = [];
                    rows.forEach(function(row) {
                        let notificationContents = notificationMap[row.idEmp];
                        if (!notificationContents) {
                                notificationContents = {
                                    idEmp: row.idEmp,
                                    nom: row.nom,
                                    prenom: row.prenom,
                                    produit: [],
                                    quantite: [],
                                };

                                notificationMap[row.idEmp] = notificationContents;
                                notifications.push(notificationContents);

                            }
                            notificationContents.produit.push({
                                nomProd: row.produit,
                                idProd : row.idProd,
                            });
                            notificationContents.quantite.push({
                                quantite: row.quantite,
                            });
                            }); 
                        CallBack(notifications);
                    }
                });
        
            }
    



    static deletProduit(inputs, CallBack) {
       
        connexion.query("delete from valise where id_produit= ? AND id_employe = ? ", [inputs.produit, inputs.employe], funcEnd);

        function funcEnd(err, results) {
            if (err) {
                CallBack('error');
            } else {
                CallBack('done');
            }
        }
    }

    static ajoutQte(inputs, CallBack) {
        connexion.query('UPDATE valise SET quantite=?  where id_produit = ? AND id_employe = ?', [inputs.qte, inputs.produit, inputs.employe], funcEnd);

        function funcEnd(err, rows) {
            if (err) {
                throw err
            } else {
                CallBack('done');

            }
        }
    }

    static afficheProd(inputs,CallBack) {
        let prod = [];
        connexion.query("SELECT nom FROM produit, valise WHERE produit.idProd != valise.id_produit AND produit.quantiteReste > 0 AND  id_employe = ? ORDER BY idProd DESC", [inputs.employe ], (err, res) => {
            if (err) throw err;
            let produits = [];
                for(let i=0; i< res.length; i++ ){
                produits += "æ"+res[i].nom;
                }
            let prod = produits.split('æ'); 

            function cleanArray(array) {
                var i, j, len = array.length, out = [], obj = {};
                for (i = 0; i < len; i++) {
                    obj[array[i]] = 0;
                }
                for (j in obj) {
                  out.push(j);
                }
                return out;
              }
            let product = cleanArray(prod);
            CallBack(product);
        });
    }


}

module.exports = Stock;