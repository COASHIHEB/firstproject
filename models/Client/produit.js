var connexion = require('../../config/db');
let devis = require('../../config/devis');
class produit{
       //la methode pour afficher un offres
    static selectProduit(input,CallBack){
        connexion.query("SELECT offre.*, souscategorie.nom as sousCategorieNom, categorie.*, categorie.nom as categorieNom, photo.nom as image FROM offre LEFT JOIN souscategorie ON offre.SousCategorie_idSousCat = souscategorie.idSousCat LEFT JOIN categorie ON categorie.idCat = souscategorie.Categorie_idCat LEFT JOIN photo ON offre.idOffre = photo.Offre_idOffre GROUP BY offre.idOffre HAVING offre.idOffre = ?",[input], (err, produit)=>{
            
            if(err) {
              CallBack("error");
            }else { 
                CallBack({produit : produit[0], devis});
            }
        });
    }


       //la methode pour afficher les 6 premier offres
    static selectProduits(CallBack){
        connexion.query("SELECT offre.*, souscategorie.nom as sousCategorieNom, categorie.*, categorie.nom as categorieNom, photo.nom as image FROM offre LEFT JOIN souscategorie ON offre.SousCategorie_idSousCat = souscategorie.idSousCat LEFT JOIN categorie ON categorie.idCat = souscategorie.Categorie_idCat LEFT JOIN photo ON offre.idOffre = photo.Offre_idOffre GROUP BY offre.idOffre LIMIT 6",[], (err, produits)=>{
            
            if(err) {
              CallBack("error");
            }else { 
                CallBack({produits, devis});
            }
        });
    }


       //la methode pour afficher les 6 premier offres sur le meme categories
    static selectProduitsParCategorie(inputs,CallBack){
        connexion.query("SELECT offre.*, souscategorie.nom as sousCategorieNom, categorie.*, categorie.nom as categorieNom, photo.nom as image FROM offre LEFT JOIN souscategorie ON offre.SousCategorie_idSousCat = souscategorie.idSousCat LEFT JOIN categorie ON categorie.idCat = souscategorie.Categorie_idCat LEFT JOIN photo ON offre.idOffre = photo.Offre_idOffre GROUP BY offre.idOffre HAVING categorie.idCat=? AND offre.idOffre<>? LIMIT 6",[inputs.code,inputs.id], (err, produits)=>{
            
            if(err) {
              CallBack("error");
            }else { 
                CallBack({produits, devis});
            }
        });
    }

       //la methode pour afficher tous les offres
    static selectAllProduit(CallBack){
        connexion.query("SELECT offre.*, souscategorie.nom as sousCategorieNom, categorie.*, categorie.nom as categorieNom, photo.nom as image FROM offre LEFT JOIN souscategorie ON offre.SousCategorie_idSousCat = souscategorie.idSousCat LEFT JOIN categorie ON categorie.idCat = souscategorie.Categorie_idCat LEFT JOIN photo ON offre.idOffre = photo.Offre_idOffre GROUP BY offre.idOffre",[], (err, produits)=>{
            
            if(err) {
              CallBack("error");
            }else { 
                CallBack({produits, devis});
            }
        });
    }


}



module.exports = produit;