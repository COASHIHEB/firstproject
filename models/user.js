let connexion = require('../config/db');
let moment = require('../config/moment');
var sha1 = require('sha1');

class user{

     /* Methode pour selection d'un user */
    static selecteUsre(inputs,CallBack){
        
        connexion.query("SELECT * FROM utilisateur WHERE email =? AND mdp =?",[inputs.pseudo, sha1(inputs.password)], (err, result)=>{
            
            if(err) {
                // mal de connection mot de passe ou pseudo peut etre faut 
              CallBack("error");
            }else { 
                // bien connecter
                CallBack(result[0]);
            }
        });
    }

    /* Methode pour un user connecter */
   static connectUsre(input,CallBack){
       
       connexion.query("UPDATE utilisateur SET connected='oui' WHERE idUtil =?",[input], (err, result)=>{
           
           if(err) {
               // mal de connection mot de passe ou pseudo peut etre faut 
             CallBack("error");
           }else { 
               // bien connecter
               CallBack('done');
           }
       });
   }

    /* Methode pour un user deconnecter */
   static disconnectUsre(input,CallBack){
       
       connexion.query("UPDATE utilisateur SET connected='non' WHERE idUtil =?",[input], (err, result)=>{
           
           if(err) {
               // mal de connection mot de passe ou pseudo peut etre faut 
             CallBack("error");
           }else { 
               // bien connecter
               CallBack('done');
           }
       });
   }

}

module.exports = user;