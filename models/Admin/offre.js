var connexion = require('../../config/db');
var moment = require('../../config/moment').moment;

class offre{

    constructor (row){
        this.row = row;
    }


    static selectCategorie( CallBack){
        let categories = [];
        let i = 0;
        connexion.query("SELECT * from categorie ORDER BY idCat DESC", (err, rows)=>{
            if (err) CallBack("error");
            
            rows.forEach(function(row) {
                let categorie = {
                    nom: row.nom,
                    id: row.idCat,
                }; 
                categories.push(categorie);
            });
             CallBack(categories );
        })
    }


    
    static addOffre( inputs,CallBack){
        let images = inputs.nameImages;
        let input = inputs.data;
        let IdOffre;
        let produit = input.produit.split('æ');
        let cat = input.sousCategorie.split('_')
        let categorie;
        categorie = cat[0];
        for(let i=1; i<cat.length; i++){
            categorie += " "+cat[i];
        }
      
        connexion.query("SELECT idSousCat AS id from souscategorie WHERE nom = ?",[categorie], (err, resultat)=>{
            if (err) throw err;
            else{
                 let idSC = resultat[0].id;
                 connexion.query("INSERT INTO offre (nom, description, prix, dure, date, SousCategorie_idSousCat) VALUES (?,?,?,?,?,?)", [input.nom, input.description, input.prix, input.dure,new Date(), idSC], (err, result)=>{
                    if(err) {
                        throw err;
                    }else{
                        IdOffre = result.insertId;
                        for(let i =0; i<images.length; i++){
                            connexion.query("INSERT INTO photo (nom,statut, Offre_idOffre) VALUES (?,?,?)", [images[i], "offre", IdOffre], (err, result)=>{
                                if(err) {
                                    throw err;
                                }else{
                                    console.log("")
                                }
                            })
                        }
                        for(let i =0; i<produit.length ; i++ ){
                            connexion.query("SELECT idProd AS id from produit WHERE nom = ?",[produit[i]], (err, resultat)=>{
                                if (err) throw err;
                                else{
                                    let idProd = resultat[0].id;
                                    connexion.query("INSERT INTO offreproduit (Produit_idProd, Offre_idOffre) VALUES (?,?)", [idProd,IdOffre], (err, result)=>{
                                    if(err) {
                                        throw err;
                                    }else{
                                        console.log("")
                                         }
                                    })
                                }
                            })
                        }
                        CallBack('done')
                    }
                })
            }
        })
    }
    


    static selecsousCategorie( CallBack){
        connexion.query("SELECT max(idCat) AS id from categorie ", (err, resultat)=>{
            if (err) CallBack('error');
            else{
                let idCat = resultat[0].id;
                connexion.query("SELECT * from souscategorie WHERE Categorie_idCat= ?",[idCat], (err, rows)=>{
                    if (err) CallBack('error');
                    else{
                        let sousCats = [];
                        rows.forEach(function(row) {
                            let nomSC = row.nom.replace(/\s/g, "_");
                            let sousCat = {
                                nom: nomSC,
                                id: row.idSousCat,
                            };
                            sousCats.push(sousCat);
                        });
                        CallBack(sousCats);
                    }
                })
            }
        })
    }


    static selectProduit( CallBack){
        connexion.query("SELECT * from produit WHERE quantiteReste > 0", (err, rows)=>{
            if (err) throw err;
            let produits = [];
            rows.forEach(function(row) {
                let produit = {
                    nom: row.nom,
                    id: row.idProd,
                    description: row.description,
                };
                produits.push(produit);
            });
            CallBack(produits);
        })
    }

    static selectSousCat(inputs, CallBack){
        let sousCats = [];
        connexion.query("SELECT idCat AS id from categorie WHERE nom= ?",[inputs.categorie], (err, resultat)=>{
            if (err) throw err;
            else{
                let idCat = resultat[0].id;
                connexion.query("SELECT * from souscategorie WHERE Categorie_idCat= ?",[idCat], (err, rows)=>{
                    if (err) throw err;
                    else{
                        rows.forEach(function(row) {
                            let nomSC = row.nom.replace(/\s/g, "_");
                            let sousCat = {
                                nom: nomSC,
                                id: row.idSousCat,
                            };
                            sousCats.push(sousCat);
                        });
                        CallBack(sousCats);
                    }
                })
            }
        })
    }
    

    static selectSousCatModif(inputs, CallBack){
        let sousCats = [];
        connexion.query("SELECT idCat AS id from categorie WHERE nom= ?",[inputs.categorie], (err, resultat)=>{
            if (err) CallBack('error');
            else{
                let idCat = resultat[0].id;
                connexion.query("SELECT * from souscategorie WHERE Categorie_idCat= ?",[idCat], (err, rows)=>{
                    if (err) CallBack('error');
                    else{
                        rows.forEach(function(row) {
                            let nomSC = row.nom.replace(/\s/g, "_");
                            let sousCat = {
                                nom: nomSC,
                                id: row.idSousCat,
                            };
                            sousCats.push(sousCat);
                        });
                        CallBack(sousCats);
                    }
                })
            }
        })
    }

    static selectOffreRec(CallBack){
        let offresRec = [];
        connexion.query("SELECT offre.idOffre AS idOffre, offre.nom AS nomOffre, offre.description AS description, offre.date AS date, offre.dure AS dure, offre.prix AS prix , souscategorie.nom AS nomSC, categorie.nom AS nomCat from offre, categorie, souscategorie WHERE souscategorie.idSousCat= offre.SousCategorie_idSousCat AND souscategorie.categorie_idCat= categorie.idCat ORDER BY offre.idOffre DESC LIMIT 10 ", (err, rows)=>{
            if (err) throw err;
            else{
                rows.forEach(function(row) {
                    let offre = {
                        id: row.idOffre,
                        nomOffre: row.nomOffre,
                        description: row.description,
                        dure: row.dure,
                        prix: row.prix,
                        date: moment(row.date).format('YYYY-MM-DD'),
                        nomSC: row.nomSC,
                        nomCat: row.nomCat,
                    };offresRec.push(offre);
                })
                
            }CallBack(offresRec)
        })
    }



    static selectOffre(CallBack){
        let nomSC ;

        connexion.query("SELECT offre.idOffre AS idOffre, offre.nom AS nomOffre, offre.description AS description, offre.dure AS dure, offre.prix AS prix , offre.date AS date, souscategorie.nom AS nomSC, categorie.nom AS nomCat, categorie.idCat AS idCat,produit.nom AS nomProd,produit.idProd AS idProd FROM  souscategorie LEFT JOIN offre ON souscategorie.idSousCat= offre.SousCategorie_idSousCat LEFT JOIN categorie ON souscategorie.categorie_idCat = categorie.idCat LEFT JOIN offreproduit ON offreproduit.Offre_idOffre = offre.idOffre LEFT JOIN produit ON offreproduit.Produit_idProd = produit.idProd ORDER BY offre.idOffre DESC", funcEND);
        function funcEND (err1, rows, fields){
            if(err1) throw err1;
            else{
                let notificationMap = {};
                let notifications = [];
                rows.forEach(function(row) {
                        let notificationContents = notificationMap[row.idOffre];
                        if (!notificationContents) {
                            if(row.nomSC){
                                nomSC = row.nomSC.replace(/\s/g, "_");
                            }else{
                                nomSC = ' ';
                            }
                                notificationContents = {
                                    idOffre: row.idOffre,
                                    nomOffre: row.nomOffre,
                                    description: row.description,
                                    dure: row.dure,
                                    date: moment(row.date).format('YYYY-MM-DD'),
                                    prix: row.prix,
                                    nomSC: nomSC,
                                    nomCat: row.nomCat,
                                    produit: [],
                                };

                                notificationMap[row.idOffre] = notificationContents;
                                notifications.push(notificationContents);

                            }
                            notificationContents.produit.push({
                                nomProd: row.nomProd,
                                idProd: row.idProd,

                            });
                            }); 
                        CallBack(notifications);
                    }
                }
            }




            static SelectPhoto(inputs,CallBack){
                let photos = [];
                connexion.query("SELECT * FROM photo WHERE Offre_idOffre = ? ",[inputs.id], (err, rows)=>{
                    if (err) CallBack('error');
                    else{
                        rows.forEach(function(row) {
                            let photo = {
                                id: row.idPhoto,
                                nom: row.nom,
                            };photos.push(photo);
                        })
                        
                    }console.log(photos);CallBack(photos)
                })
            }



            static deleteOffre(inputs, CallBack){
                connexion.query("DELETE FROM photo WHERE Offre_idOffre =?",[inputs.idOffre], (err, result)=>{
                   if(err) {
                       CallBack('error');
                   }else { 
                    connexion.query("DELETE FROM offreproduit WHERE Offre_idOffre =?",[inputs.idOffre], (err, result)=>{
                        if(err) {
                            CallBack('error');
                        }else { 
                            connexion.query("DELETE FROM offre WHERE idOffre =?",[inputs.idOffre], (err, result)=>{
                                if(err) {
                                    CallBack('error');
                                }else { 
                                    CallBack('done')
                                }
                            })
                        }
                    })
                   }
                })
            }




            static supprimerPhoto(inputs, CallBack){
                connexion.query("DELETE FROM photo WHERE idPhoto =?",[inputs.id], (err, result)=>{
                   if(err) {
                       CallBack('error');
                   }else { 
                    CallBack('done');
                   }
                })
            }


            static addPhoto(inputs, CallBack){
                let input = inputs.data;
                let images = inputs.nameImages;
                for(let i =0; i<images.length; i++){
                    connexion.query("INSERT INTO photo (nom,statut, Offre_idOffre) VALUES (?,?,?)", [images[i], "offre", input.idOffre], (err, result)=>{
                        if(err) {
                            throw err;
                        }
                    })
                } CallBack('done')
            }


            static deletProduitOffre(inputs, CallBack){
                connexion.query("DELETE FROM offreproduit WHERE Produit_idProd =? AND Offre_idOffre= ?",[inputs.idProd,inputs.idOffre], (err, result)=>{
                   if(err) {
                       throw err;
                   }else { 
                    CallBack('done');
                   }
                })
            }




            static modifierOffre( inputs,CallBack){
                let IdOffre;
                let cat = inputs.sousCategorie.split('_')
                let categorie;
                categorie = cat[0];
                for(let i=1; i<cat.length; i++){
                    categorie += " "+cat[i];
                }
                connexion.query("SELECT idSousCat AS id from souscategorie WHERE nom = ?",[categorie], (err, resultat)=>{
                    if (err) CallBack('error');
                    else{
                            let idSC = resultat[0].id;
                            connexion.query("UPDATE offre SET nom=? , description=? , prix=?, dure=?, SousCategorie_idSousCat=? Where idOffre = ?", [inputs.nom, inputs.description, inputs.prix, inputs.dure,idSC, inputs.id], (err, result)=>{
                            if(err) {
                                CallBack('error');
                            }else{
                                if( typeof inputs.produitsOffre !== "undefined" ){
                                    let produit = inputs.produitsOffre.split('æ');
                                    for(let i =0; i<produit.length ; i++ ){
                                        let prod = produit[i].trim();
                                        connexion.query("SELECT idProd AS id from produit WHERE nom = ?",[prod], (err, resultat)=>{
                                            if (err) CallBack('error');
                                            else{
                                                let idProd = resultat[0].id;
                                                connexion.query("INSERT INTO offreproduit (Produit_idProd, Offre_idOffre) VALUES (?,?)", [idProd,inputs.id], (err, result)=>{
                                                if(err) {
                                                    CallBack('error');
                                                }else{
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                                CallBack('done')
                            }
                        })
                    }
                })
                }




                static selectSousCatOffre(CallBack){
                    let sousCats = [];
                    let nomSC;
                    connexion.query("SELECT categorie.nom AS nomCat, souscategorie.nom AS nomSSCat from categorie LEFT JOIN souscategorie ON categorie.idCat = souscategorie.Categorie_idCat", (err, rows)=>{
                        if (err) CallBack('error');
                        else{
                            
                            rows.forEach(function(row) {
                                if(row.nomSSCat){
                                    nomSC = row.nomSSCat.replace(/\s/g, "_");
                                }else{
                                    nomSC = ' ';
                                }
                                let sousCat = {
                                    nomCat: row.nomCat,
                                    nomSC: nomSC,
                                };
                                sousCats.push(sousCat);
                            });
                            CallBack(sousCats);
                               
                        }
                    })
                }
            }




            module.exports = offre;