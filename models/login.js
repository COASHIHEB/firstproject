let connexion = require('../config/db');
let moment = require('../config/moment');
var sha1 = require('sha1');
class login{

     /* Methode pour login */
    static login(inputs,CallBack){
        
        connexion.query("SELECT * FROM utilisateur WHERE email =? AND mdp =?",[inputs.pseudo, sha1(inputs.password)], (err, result)=>{
            
            if(err || typeof result[0] === "undefined") {
                // mal de connection mot de passe ou pseudo peut etre faut 
              CallBack("error");
            }else if(result[0].valide === "non"){
                // le compte n'est pas validé
              CallBack("NonValide");
            }
            else { 
                // bien connecter
                CallBack({
                    id: result[0].idUtil,
                    statut: result[0].statut,
                });
            }
        });
    }

    /* Methode pour un random mot de passe */
    static password(input,CallBack){ 
        connexion.query("SELECT * FROM utilisateur WHERE email =?",[input], (err, result)=>{
            
            if(err || typeof result[0] === "undefined") {
                // mal de connection mot de passe ou pseudo peut etre faut 
              CallBack("error");
            }else if(result[0].valide === "non"){
                // le compte n'est pas validé
              CallBack("NonValide");
            }
            else { 
                // bien connecter
            const generateRandomCode = (() => {
            let  USABLE_CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXRZ0123456789".split("");
            return length => {
              return new Array(length).fill(null).map(() => {
                return USABLE_CHARACTERS[Math.floor(Math.random() * USABLE_CHARACTERS.length)];
                }).join("");
              }
            } )();         
            let code = generateRandomCode(10);

            /*Modifier le mot de passe sur BDD*/
            connexion.query("UPDATE utilisateur SET mdp =? WHERE email =?", [sha1(code), input], (err, res)=>{
                if(err) {
                    CallBack('nonModifier');
                }else { 
                    CallBack(code);
                }
            });
                
            }
        });
    }

}

module.exports = login;