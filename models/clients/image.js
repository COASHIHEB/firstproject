var connexion = require('../../config/db');

class image{

       //la methode pour afficher les images des produits
    static selectImages(CallBack){
        connexion.query("SELECT * FROM photo WHERE statut = 'offre'",[], (err, images)=>{
            
            if(err) {
              CallBack("error");
            }else { 
                CallBack(images);
            }
        });
    }
    

}



module.exports = image;