var connexion = require('../../config/db');
class produit{
       //la methode pour afficher les 6 premier offres
    static selectProduit(CallBack){
        connexion.query("SELECT offre.*, souscategorie.nom as sousCategorieNom, souscategorie.nom as categorieNom, photo.nom as image FROM offre LEFT JOIN souscategorie ON offre.SousCategorie_idSousCat = souscategorie.idSousCat LEFT JOIN categorie ON categorie.idCat = souscategorie.Categorie_idCat LEFT JOIN photo ON offre.idOffre = photo.Offre_idOffre GROUP BY offre.idOffre LIMIT 6",[], (err, produits)=>{
            
            if(err) {
              CallBack("error");
            }else { 
                CallBack(produits);
            }
        });
    }

       //la methode pour afficher tous les offres
    static selectAllProduit(CallBack){
        connexion.query("SELECT offre.*, souscategorie.nom as sousCategorieNom, categorie.*, categorie.nom as categorieNom, photo.nom as image FROM offre LEFT JOIN souscategorie ON offre.SousCategorie_idSousCat = souscategorie.idSousCat LEFT JOIN categorie ON categorie.idCat = souscategorie.Categorie_idCat LEFT JOIN photo ON offre.idOffre = photo.Offre_idOffre GROUP BY offre.idOffre",[], (err, produits)=>{
            
            if(err) {
              CallBack("error");
            }else { 
                CallBack(produits);
            }
        });
    }

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
    
       //la methode pour séléctionner les catégories et les sous categories 
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



module.exports = produit;