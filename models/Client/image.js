var connexion = require('../../config/db');

class image{

       //la methode pour afficher les images des produits
    static selectAllImages(CallBack){
        connexion.query("SELECT * FROM photo WHERE statut = 'offre'",[], (err, images)=>{
            
            if(err) {
              CallBack("error");
            }else { 
                CallBack(images);
            }
        });
    }

       //la methode pour afficher les images d'un produit
    static selectImages(input,CallBack){
        connexion.query("SELECT * FROM photo WHERE Offre_idOffre =?",[input], (err, images)=>{
            
            if(err) {
              CallBack("error");
            }else { 
                CallBack(images);
            }
        });
    }
    

}



module.exports = image;