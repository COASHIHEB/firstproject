var connexion = require('../../config/db');
var moment = require('../../config/moment').moment;
var sha1 = require('sha1');
class register {
    //la methode pour creer un client
    static register(inputs, CallBack) {
        //verifier si l'email n'exste pas 
        connexion.query("SELECT * FROM utilisateur WHERE email =? ", [inputs.email], (err, reslt) => {
            if (err) {
                CallBack("error");
            } else if (typeof reslt[0] !== "undefined") {
                if (reslt[0].email === inputs.email) { CallBack("exist"); }
            } else {
                let password = sha1(inputs.password);
                connexion.query("INSERT INTO utilisateur (nom, prenom, email, mdp, numTel, adresse, date) VALUES (?,?,?,?,?,?,?)", [inputs.nom, inputs.prenom, inputs.email, password, inputs.tel, inputs.adresse, new Date()], (err, result) => {
                    if (err) {
                        CallBack('notInsert');
                    } else {
                        connexion.query("SELECT * FROM utilisateur WHERE email =? ", [inputs.email], (err, res) => {

                            const generateRandomCode = (() => {
                                let USABLE_CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
                                return length => {
                                    return new Array(length).fill(null).map(() => {
                                        return USABLE_CHARACTERS[Math.floor(Math.random() * USABLE_CHARACTERS.length)];
                                    }).join("");
                                }
                            })();
                            let code = generateRandomCode(6);
                            connexion.query("INSERT INTO adherent (code, utilisateur_idUtil) VALUES (?,?)", [code, res[0].idUtil], (err, rlt) => {
                                if (err) {
                                    CallBack("error");
                                } else {
                                    CallBack({
                                        code: code,
                                        id: res[0].idUtil,
                                    });
                                }
                            });
                        });
                    }
                });
            }
        });
    }


    //la methode pour validé un compt client
    static valider(input, CallBack) {
        if (input) {
            if (input.split("").length > 34) {
                let id = "";
                for (let index = 0; index < (input.split("").length - 53 + 1); index++) {
                    id += input.split("")[index + 36];
                }

                connexion.query("SELECT * FROM utilisateur WHERE idUtil =? ", [parseInt(id)], (err, res) => {
                    if (err) {
                        CallBack('error');
                    } else {
                        connexion.query("UPDATE utilisateur SET valide=? WHERE (idUtil =?) ", ["oui", parseInt(id)], (err, result) => {

                            if (err) {
                                CallBack('error');
                            } else {
                                CallBack('valide');
                            }
                        });
                    }
                });
            } else {
                CallBack('error');
            }
        } else {
            CallBack('error');
        }

    }

}



module.exports = register;