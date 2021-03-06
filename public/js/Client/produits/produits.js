var produits=[];

$(document).ready(function(){
  /************************serach **********************/
  $("#myInputt").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#prduitsListes div.class").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  /************************Global serach **********************/
  $("#searchButton").click(function(){
    search();
  });

});


/************************Global serach Function**********************/
function search(){
  if($('#search').val() != ''){
     $('#prduitsListes').empty();
     $('#sousCat').empty();
     $('#separateur2').empty();
     $('#categorie').empty();
     $('#separateur1').empty();
       produits.forEach(element => {
         if(element.nom.toLowerCase() == $('#search').val().toLowerCase() || element.prix.toLowerCase() == $('#search').val().toLowerCase() || element.description.toLowerCase() == $('#search').val().toLowerCase() || element.categorieNom.toLowerCase() == $('#search').val().toLowerCase() || element.sousCategorieNom.toLowerCase() == $('#search').val().toLowerCase() ){
          $('#prduitsListes').append("<div class='col-lg-3 col-sm-6 class'><div class='product-item'><div class='pi-pic'><img src='images/offre/"+element.image+"' alt='produitImage' style='cursor:pointer; width: 100%; height: 300px;' data-toggle='modal' data-target='#myModal"+element.idOffre+"'><div class='pi-links'><a style='cursor: pointer' onclick='addItem("+element.idOffre+","+parseFloat(element.prix)+")' class='add-card'><i class='flaticon-bag'></i><span>AJOUTER</span></a></div></div><div class='pi-text'><h6>"+element.prix+"</h6><p>"+element.nom+"</p><p><a href='produit?code="+element.idOffre+"' target='_blank'>Plus...</a></p></div></div>");  
         }
       });
       $('#prduitsListes--pager').remove();
       $('#prduitsListes').buzinaPagination({
          itemsOnPage:5
        });
  }
}
   

/********     Methode pour modifier l'image du galrie    *******/
function updateImage(idImage,idOffre){
  $('#myModal'+idOffre+' #content img').attr('src',$('#image'+idImage).attr('src'));
}

/********     Methode pour modifier le css du botton active du paggination    *******/
function page(total,item){
  for(var i = 1; i<=total; i++){
    if(item == i){
      $('#item'+i+' a').css('background-color','mediumvioletred');
      $('#item'+i+' a').css('color','#282828');
    }else{
      $('#item'+i+' a').css('background-color','#282828');
      $('#item'+i+' a').css('color','white');
    }
  }
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
          $('#prduitsListes').append("<div class='col-lg-3 col-sm-6 class'><div class='product-item'><div class='pi-pic'><img src='images/offre/"+element.image+"' alt='produitImage' style='cursor:pointer; width: 100%; height: 300px;' data-toggle='modal' data-target='#myModal"+element.idOffre+"'><div class='pi-links'><a style='cursor: pointer' onclick='addItem("+element.idOffre+","+parseFloat(element.prix)+")' class='add-card'><i class='flaticon-bag'></i><span> AJOUTER </span></a></div></div><div class='pi-text'><h6>"+element.prix+"</h6><p>"+element.nom+"</p><p><a href='produit?code="+element.idOffre+"' target='_blank'>Plus...</a></p></div></div>");  
         }
       });
       $('#categorie').attr('onclick','categorie('+idCatt+',\''+cat+'\')');
       $('#categorie').text(cat);
       $('#separateur2').text('>');
       $('#sousCat').text(sousCat);
       $('#sousCat').attr('onclick','sousCategorie('+idSousCat+','+idCatt+',\''+cat+'\',\''+sousCat+'\')');
       $('#separateur1').text('>');
       $('#prduitsListes--pager').remove();
       $('#prduitsListes').buzinaPagination({
          itemsOnPage:5
        });
     
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
       $('#prduitsListes').append("<div class='col-lg-3 col-sm-6 class'><div class='product-item'><div class='pi-pic'><img src='images/offre/"+element.image+"' alt='produitImage' style='cursor:pointer; width: 100%; height: 300px;' data-toggle='modal' data-target='#myModal"+element.idOffre+"'><div class='pi-links'><a style='cursor: pointer' onclick='addItem("+element.idOffre+","+parseFloat(element.prix)+")' class='add-card'><i class='flaticon-bag'></i><span> AJOUTER </span></a></div></div><div class='pi-text'><h6>"+element.prix+"</h6><p>"+element.nom+"</p><p><a href='produit?code="+element.idOffre+"' target='_blank'>Plus...</a></p></div></div>");  
    });

  }else{
    produits.forEach(element => {
      if(element.idCat == id){
       $('#prduitsListes').append("<div class='col-lg-3 col-sm-6 class'><div class='product-item'><div class='pi-pic'><img src='images/offre/"+element.image+"' alt='produitImage' style='cursor:pointer; width: 100%; height: 300px;' data-toggle='modal' data-target='#myModal"+element.idOffre+"'><div class='pi-links'><a style='cursor: pointer' onclick='addItem("+element.idOffre+","+parseFloat(element.prix)+")' class='add-card'><i class='flaticon-bag'></i><span> AJOUTER </span></a></div></div><div class='pi-text'><h6>"+element.prix+"</h6><p>"+element.nom+"</p><p><a href='produit?code="+element.idOffre+"' target='_blank'>Plus...</a></p></div></div>");  
      }
    });
    $('#categorie').attr('onclick','categorie('+id+',\''+nom+'\')');
    $('#categorie').text(cat);
    $('#separateur2').text('>');
    $('#prduitsListes--pager').remove();
    $('#prduitsListes').buzinaPagination({
       itemsOnPage:5
     });
  }
  
}