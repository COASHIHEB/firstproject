var connexion = require('../../config/db');
var moment = require('../../config/moment');
var sha1 = require('sha1');
class employe{

    constructor (row){
        this.row = row;
    }


    static addUser(inputs, CallBack){
        let password= sha1(inputs.password);

        const generateRandomCode = (() => {
            let  USABLE_CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
            return length => {
              return new Array(length).fill(null).map(() => {
                return USABLE_CHARACTERS[Math.floor(Math.random() * USABLE_CHARACTERS.length)];
              }).join("");
            }
          } )();
          
        let code = generateRandomCode(6);
        if((inputs.password != '') && (inputs.nomUser != '') && (inputs.prenomUser != '') && (inputs.email != '') && (inputs.tel != '') && (inputs.adresse != '')){ 
            connexion.query("INSERT INTO utilisateur (nom, prenom, email, mdp, numTel, adresse, date, statut) VALUES (?,?,?,?,?,?,?,?)", [inputs.nomUser, inputs.prenomUser,inputs.email, password, inputs.tel, inputs.adresse, new Date(),inputs.type], (err, result)=>{
                if(err) {
                    CallBack('error');
                    throw err;
                }else { 
                    if(inputs.type =="Administrateur"){
                        CallBack('done')
                    }
                    if(inputs.type == "Employe"){
                        connexion.query("SELECT max(idUtil) AS id from utilisateur", (err, result)=>{
                            if(err) {
                                CallBack('error');
                            }else { 
                                connexion.query("INSERT INTO employe (code, utilisateur_idUtil) VALUES (?,?)", [code,result[0].id ], (err, result)=>{
                                    if(err) {
                                        CallBack('error');
                                    }else { 
                                        CallBack('done');
                                    }
                                })
                            }
                        })
                    }
                }
            });
        }else{
            CallBack('error');
        }
    }




    static selectEmploye(CallBack){
        connexion.query("SELECT * FROM utilisateur, employe WHERE employe.utilisateur_idUtil = utilisateur.idUtil AND utilisateur.statut = ? ORDER BY employe.idEmp DESC",['Employe'], (err, rows)=>{
            if (err) throw err;
            let employes = [];
            rows.forEach(function(row) {
                let emp = {
                    id: row.idUtil,
                    date: moment(row.dateDebut).format('YYYY-MM-DD'),
                    mail: row.email,
                    nom: row.nom,
                    prenom: row.prenom,
                    code: row.code,
                    tel: row.numTel,
                    statut : row.statut,
                    valide : row.valide,
                    permis : row.permis,
                };
                employes.push(emp);
            });
            CallBack(employes);
        });
    }



    static selectAdmin(CallBack){
        connexion.query("SELECT * FROM utilisateur WHERE statut = ? ORDER BY idUtil DESC",['Administrateur'], (err, rows)=>{
            if (err) throw err;
            let Admins = [];
            rows.forEach(function(row) {
                let admin = {
                    id: row.idAdmin,
                    pseudo: row.pseudo,
                    mail: row.email,
                    nom: row.nom,
                    prenom: row.prenom,
                    tel: row.numTel,
                };
                Admins.push(admin);
            });
            CallBack(Admins);
        });
    }


    static deleteEmp(inputs, CallBack){
        connexion.query("DELETE FROM employe WHERE utilisateur_idUtil=?",[inputs.idutilisateur], (err, result)=>{
           if(err) {
               CallBack('error');
           }else { 
                connexion.query("DELETE FROM utilisateur WHERE idUtil=?",[inputs.idutilisateur], (err, result)=>{
                if(err) {
                    CallBack('error');
                }else { 
                    CallBack('done');
                }
            });
           }
       });
   }


   static modifierEmp(inputs, CallBack){console.log("aaaaa")
    connexion.query("UPDATE utilisateur SET  nom = ? , prenom = ?, email = ?, numTel = ? WHERE (idUtil = ?)", [inputs.nom, inputs.prenom, inputs.email, inputs.tel, inputs.id ] ,(err, result)=>{
        if(err) {
            // CallBack('error');
            throw err;
        }
        else { 
            // CallBack('done');
            connexion.query("UPDATE employe SET code = ? , permis = ? WHERE (utilisateur_idUtil = ?)", [inputs.code, inputs.permis, inputs.id ] ,(err, result)=>{
                if(err) {
                    // CallBack('error');
                    throw err;
                }
                else { 
                    CallBack('done');
                }
            });
        }
    });
}
    
    static selectEmployer(input, CallBack){
        connexion.query("SELECT * FROM employe WHERE utilisateur_idUtil = ?",[input], (err, employe)=>{
            if(err){
                CallBack('error');
            }else if(employe.length === 0){
                CallBack('done');
            }else{
                CallBack('exist');
            }
        });
    }
    
    static addEmployer(input, CallBack){

        const generateRandomCode = (() => {
            let  USABLE_CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
            return length => {
              return new Array(length).fill(null).map(() => {
                return USABLE_CHARACTERS[Math.floor(Math.random() * USABLE_CHARACTERS.length)];
              }).join("");
            }
          } )();
        
        connexion.query("INSERT INTO employe (code, utilisateur_idUtil) VALUES (?,?)", [generateRandomCode(6),input ], (err, result)=>{
            if(err) {
                CallBack('error');
            }else { 
                CallBack('done');
            }
        });
    }

    static deleteEmployer(input, CallBack){
        connexion.query("DELETE FROM employe WHERE utilisateur_idUtil=?",[input], (err, result)=>{
            if(err) {
                CallBack('error');
            }else { 
                CallBack('done');
            }
        });
    }
}

module.exports = employe;