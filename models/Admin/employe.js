var connexion = require('../../config/db');
var moment = require('../../config/moment').moment;
var date = require('../../config/moment').date;
var sha1 = require('sha1');
class employe {

    constructor(row) {
        this.row = row;
    }


    static addUser(inputs, CallBack) {
        let password = sha1(inputs.password);

        const generateRandomCode = (() => {
            let USABLE_CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
            return length => {
                return new Array(length).fill(null).map(() => {
                    return USABLE_CHARACTERS[Math.floor(Math.random() * USABLE_CHARACTERS.length)];
                }).join("");
            }
        })();

        let code = generateRandomCode(6);
        if ((inputs.password != '') && (inputs.nomUser != '') && (inputs.prenomUser != '') && (inputs.email != '') && (inputs.tel != '') && (inputs.adresse != '')) {
            connexion.query("INSERT INTO utilisateur (nom, prenom, email, mdp, numTel, adresse, date, statut, valide,image) VALUES (?,?,?,?,?,?,?,?,?,?)", [inputs.nomUser, inputs.prenomUser, inputs.email, password, inputs.tel, inputs.adresse, date, inputs.type, "oui", "profil.png"], (err, result) => {
                if (err) {
                    CallBack('error');
                } else {
                    if (inputs.type == "Administrateur") {
                        CallBack('done')
                    }
                    if (inputs.type == "Employe") {
                        connexion.query("SELECT max(idUtil) AS id from utilisateur", (err, result) => {
                            if (err) {
                                CallBack('error');
                            } else {
                                connexion.query("INSERT INTO employe (code, utilisateur_idUtil) VALUES (?,?)", [code, result[0].id], (err, result) => {
                                    if (err) {
                                        CallBack('error');
                                    } else {
                                        CallBack('done');
                                    }
                                })
                            }
                        })
                    }
                }
            });
        } else {
            CallBack('error');
        }
    }




    static selectEmploye(CallBack) {
        connexion.query("SELECT * FROM utilisateur, employe WHERE employe.utilisateur_idUtil = utilisateur.idUtil AND utilisateur.statut = ? ORDER BY employe.idEmp DESC", ['Employe'], (err, rows) => {
            if (err) throw err;
            let employes = [];
            rows.forEach(function (row) {
                connexion.query("SELECT SUM(etoile) AS etoile, COUNt(idFB) AS FB FROM feedbak WHERE Employe_idEmp = ?", [row.idEmp], (err, resultat) => {
                    if (err) throw err;
                    else {
                        let etoile = 0;
                        let pourcentage = 0;
                        if (resultat[0].etoile) {
                            etoile = parseFloat(resultat[0].etoile / resultat[0].FB).toFixed(2);
                            pourcentage = parseFloat((etoile * 100) / 5).toFixed(2);
                        }
                        let emp = {
                            id: row.idUtil,
                            date: moment(row.dateDebut).format('YYYY-MM-DD'),
                            mail: row.email,
                            nom: row.nom,
                            prenom: row.prenom,
                            code: row.code,
                            tel: row.numTel,
                            statut: row.statut,
                            valide: row.valide,
                            permis: row.permis,
                            isconnected: row.connected,
                            image: row.image,
                            etoile: etoile,
                            pourcentage: pourcentage,
                            nombre: resultat[0].FB,
                        };
                        employes.push(emp);
                    }
                })
            });
            CallBack(employes);
        });
    }



    static selectAdmin(CallBack) {
        connexion.query("SELECT * FROM utilisateur WHERE statut = ? ORDER BY idUtil DESC", ['Administrateur'], (err, rows) => {
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


    static deleteEmp(inputs, CallBack) {
        connexion.query("DELETE FROM employe WHERE utilisateur_idUtil=?", [inputs.idutilisateur], (err, result) => {
            if (err) {
                CallBack('error');
            } else {
                connexion.query("DELETE FROM utilisateur WHERE idUtil=?", [inputs.idutilisateur], (err, result) => {
                    if (err) {
                        CallBack('error');
                    } else {
                        CallBack('done');
                    }
                });
            }
        });
    }


    static modifierEmp(inputs, CallBack) {
        connexion.query("UPDATE utilisateur SET  nom = ? , prenom = ?, email = ?, numTel = ? WHERE (idUtil = ?)", [inputs.nom, inputs.prenom, inputs.email, inputs.tel, inputs.id], (err, result) => {
            if (err) {
                CallBack('error');
            }
            else {
                connexion.query("UPDATE employe SET code = ? , permis = ? WHERE (utilisateur_idUtil = ?)", [inputs.code, inputs.permis, inputs.id], (err, result) => {
                    if (err) {
                        CallBack('error');
                    }
                    else {
                        CallBack('done');
                    }
                });
            }
        });
    }
}

module.exports = employe;