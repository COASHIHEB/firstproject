var connexion = require('../../config/db');
class categorie{
    
       //la methode pour séléctionner les catégories et les sous categories 
       static selectCategories(CallBack){
        connexion.query("SELECT * FROM categorie",[], (err, categories)=>{
            if(err) {
              CallBack("error");
            }else { 
                connexion.query("SELECT * FROM souscategorie",[], (err, sousCategories)=>{
                   CallBack({categories : categories , sousCategories : sousCategories});
                });
            }
        });
    }


}



module.exports = categorie;