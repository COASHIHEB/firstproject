var connexion = require('../../config/db');
var moment = require('../../config/moment').moment;
var sha1 = require('sha1');



class profile {

    constructor(row) {
        this.row = row;
    }


    static getUtilisateur(idUtil, CallBack) {
        connexion.query("SELECT * FROM utilisateur  where idUtil=?", [idUtil], (err, user) => {
            if (err) {
                CallBack('error');
            } else {
                CallBack({
                    nom: user[0].nom,
                    prenom: user[0].prenom,
                    email: user[0].email,
                    numTel: user[0].numTel,
                    adresse: user[0].adresse,
                    image: user[0].image,
                    statut: user[0].statut,
                    date: moment(user[0].date).format('YYYY-MM-DD'),
                });
            }
        });
    }



    static updateUtilisateur(inputs, CallBack) {
        var idUtil = inputs.userId;
        var inputs = inputs.user;
        connexion.query("update utilisateur  SET nom=? ,prenom=? ,numTel=? ,adresse=? where idUtil=?",
            [inputs.nom, inputs.prenom, inputs.numTel, inputs.adresse, idUtil], (err, rows) => {
                if (err) throw err;
                CallBack("done");
            });
    }


    static updateProfilePicture(inputs, CallBack) {
        var idUtil = inputs.userId;
        var nameImage = inputs.nameImage;
        connexion.query("update utilisateur  SET image=? where idUtil=?",
            [nameImage, idUtil], (err, rows) => {
                if (err) throw CallBack("error");
                else CallBack({
                    statut: "done",
                    image: nameImage
                });
            });
    }


    static updatePassword(inputs, CallBack) {
        var userId = inputs.userId
        var inputs = inputs.user

        connexion.query("SELECT * FROM utilisateur WHERE idUtil=? AND mdp=?",
            [userId, sha1(inputs.oldPassword)], (err, rows) => {

                if (err) throw err;
                else if (typeof rows[0] === "undefined") {
                    // mal de connection mot de passe ou pseudo peut etre faut 
                    CallBack("passwordInvalide");
                } else {
                    connexion.query("update utilisateur  SET mdp=? where idUtil=?",
                        [sha1(inputs.newPassword), userId], (err, rows) => {
                            if (err) throw err;
                            CallBack("done");
                        });
                }
            });
    }

}




module.exports = profile;