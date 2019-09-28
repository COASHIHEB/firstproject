var produits=[];
/********     Methode pour modifier l'image du galrie    *******/
function updateImage(idImage,idOffre){
    $('#myModal'+idOffre+' #content img').attr('src',$('#image'+idImage).attr('src'));
}


/***************     Methode pour récupérie les catégorie     ********/
function afficherCategorie(){
  $.post("selecteCategories",
  function (data, status) {
    if (data == 'error') {
    } else {
      produits = data.produits;
      data.categories.categories.forEach(element => {
        $('.sidenav').append("<li  style='cursor:pointer' id='li"+element.idCat+"'  onclick='openSousCat("+element.idCat+")'><span class='fa fa-toggle-right'></span>  "+element.nom+"</li><div id='div"+element.idCat+"'></div>");
        data.categories.sousCategories.forEach(elementt => {
          if(element.idCat == elementt.Categorie_idCat){
            $('#div'+element.idCat).append("<a style='padding-left:35px' href='#'  onclick=\"sousCategorie("+elementt.idSousCat+","+element.idCat+",'"+element.nom+"','"+elementt.nom+"')\">- "+elementt.nom+"</a>");
          }
        });
        $("#div"+element.idCat).hide();
      });
    }
  });
}


/***************     Methode pour afficher les sous categories    ********/
function openSousCat(id){
  $("#div"+id).show();
  $("#li"+id).attr('onclick','closeSousCat('+id+')');
  $("#li"+id+" span").removeClass("fa-toggle-right");
  $("#li"+id+" span").addClass("fa-toggle-down");
}

/***************     Methode pour cacher les sous categories    ********/
function closeSousCat(id){
  $("#div"+id).hide();
  $("#li"+id).attr('onclick','openSousCat('+id+')');
  $("#li"+id+" span").removeClass("fa-toggle-down");
  $("#li"+id+" span").addClass("fa-toggle-right");
}


/***************     Methode pour récupérie les paroduits par sous catégorie    ********/
function sousCategorie(idSousCat,idCatt, cat, sousCat){
    $('#prduitsListes').empty();
    produits.forEach(element => {
         if(element.SousCategorie_idSousCat == idSousCat){
          $('#prduitsListes').append("<div class='col-lg-3 col-sm-6'><div class='product-item'><div class='pi-pic'><img src='images/offre/"+element.image+"' alt='produitImage' style='cursor:pointer; width: 100%; height: 300px;' data-toggle='modal' data-target='#myModal"+element.idOffre+"'><div class='pi-links'><a href='#' class='add-card'><i class='flaticon-bag'></i><span>ADD TO CART</span></a><a href='#' class='wishlist-btn'><i class='flaticon-heart'></i></a></div></div><div class='pi-text'><h6>"+element.prix+"</h6><p>"+element.nom+"</p><p><a href='produit?code="+element.idOffre+"' target='_blank'>Plus...</a></p></div></div>");  
         }
       });
       $('#categorie').attr('onclick','categorie('+idCatt+',\''+cat+'\')');
       $('#categorie').text(cat);
       $('#separateur2').text('>');
       $('#sousCat').text(sousCat);
       $('#sousCat').attr('onclick','sousCategorie('+idSousCat+','+idCatt+',\''+cat+'\',\''+sousCat+'\')');
       $('#separateur1').text('>');
     
}




/***************     Methode pour récupérie les paroduits par sous catégorie  par le chemain   ********/
function categorie(id, nom){
  $('#prduitsListes').empty();
  $('#sousCat').empty();
  $('#separateur2').empty();
  if(id == 0){
    $('#categorie').empty();
    $('#separateur1').empty();
    produits.forEach(element => {
       $('#prduitsListes').append("<div class='col-lg-3 col-sm-6'><div class='product-item'><div class='pi-pic'><img src='images/offre/"+element.image+"' alt='produitImage' style='cursor:pointer; width: 100%; height: 300px;' data-toggle='modal' data-target='#myModal"+element.idOffre+"'><div class='pi-links'><a href='#' class='add-card'><i class='flaticon-bag'></i><span>ADD TO CART</span></a><a href='#' class='wishlist-btn'><i class='flaticon-heart'></i></a></div></div><div class='pi-text'><h6>"+element.prix+"</h6><p>"+element.nom+"</p><p><a href='produit?code="+element.idOffre+"' target='_blank'>Plus...</a></p></div></div>");  
    });

  }else{
    produits.forEach(element => {
      if(element.idCat == id){
       $('#prduitsListes').append("<div class='col-lg-3 col-sm-6'><div class='product-item'><div class='pi-pic'><img src='images/offre/"+element.image+"' alt='produitImage' style='cursor:pointer; width: 100%; height: 300px;' data-toggle='modal' data-target='#myModal"+element.idOffre+"'><div class='pi-links'><a href='#' class='add-card'><i class='flaticon-bag'></i><span>ADD TO CART</span></a><a href='#' class='wishlist-btn'><i class='flaticon-heart'></i></a></div></div><div class='pi-text'><h6>"+element.prix+"</h6><p>"+element.nom+"</p><p><a href='produit?code="+element.idOffre+"' target='_blank'>Plus...</a></p></div></div>");  
      }
    });
    $('#categorie').attr('onclick','categorie('+id+',\''+nom+'\')');
    $('#categorie').text(cat);
    $('#separateur2').text('>');
  }
  
}