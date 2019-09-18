
let numberIMager = 1;
let numberIMager2 = 1;
var formData2 = new FormData();
let categorieModif = '';
let sousCategorieModif ='';

$(document).ready(function () {
  
  document.getElementById("submit").disabled = true;


  
})


function ajouterPhoto2()
{
  var file;
  var input = document.getElementById("pictureFileAdd");
  var len = input.files.length;
  for(let i=0;i<len;i++){ 
    if (len && input.files[i]) {
  var reader = new FileReader();
      reader.onload = function (e) {
        $("#sliderImageAjout").append(" <img id='image"+numberIMager2+"' style='width:100px;height:100px'>");
        $('#image'+numberIMager2).attr('src', e.target.result);
        file = document.getElementById("pictureFileAdd").files[i];
        formData2.append("post_file", file);
        numberIMager2++;
      }
      reader.readAsDataURL(input.files[i]);
    }
  }
  
}

$(document).ready(function () {

  $('#tableau2').DataTable({
    responsive: true,
    "lengthMenu": [10, 25, 50, 75, 100],
  });
});


 function resetFileds(){
    location.reload();
 }



 function alertMod(){
    $.post("selectOffre", {
 },

 function (data, status) {
    if (data != 'error') {
    }
  })
 }

function selCat() {
  var categorie = $('#sel').val();
    $.post("selectSousCat", {
         categorie : categorie,
      },
      function (data, status) {
        if (data != 'error') {
          
          let toReplac = '<div class="col-sm-3"  id="sousCat"><select class="chercheBarDropDown form-control">'; 
          for(let i=0; i<data.length; i++){ 
            toReplac+= '<option id="option" value='+data[i].nom+' name="sousCateg" > '+data[i].nom+'</option> ';
          }
          toReplac+= '</select></div>';
          $("#sousCat").replaceWith (toReplac);
        } 
      });
}


function selCatModif() {
  var categorie = $('#categorieModif').val();
    $.post("selectSousCatModif", {
         categorie : categorie,
      },
      function (data, status) {
        if (data != 'error') {
          let toReplac = '<td  id="sousCatModif"><select class="chercheBarDropDown form-control">'; 
          for(let i=0; i<data.length; i++){ 
            toReplac+= '<option id="option" value='+data[i].nom+' name="sousCateg" > '+data[i].nom+'</option> ';
          }
          toReplac+= '</select></td>';
          $("#sousCatModif").replaceWith (toReplac);
        } 
      });
}




function verifier() {
  let produitsOffre;
  let categorie;
  let sousCategorie;
  let produits = new Array();

  $('option:checked[name=cat]').each(function(){
    categorie = $(this).val();
   });

   $('option:checked[name=sousCateg]').each(function(){
    sousCategorie = $(this).val();
   });

   $('option:checked[name=produit]').each(function(){
    var produit = $(this).val();
    produits.push(produit);
    })

    produitsOffre = produits[0];
    for( let i=1; i < produits.length; i++){
      produitsOffre += "æ"+produits[i];
    }      


    if(($("#nom").val() != '') && ($("#description").val() != '') && ($("#dure").val() != '') && ($("#prix").val() != '') && (categorie != '') && (sousCategorie != '') && (produits.length > 0) && ($("#pictureFile").val() != '')){
        document.getElementById("submit").disabled = false;
    }
}






$(document).ready(function () {
  var formData = new FormData();
  $("#submit").click(function () {
    let produits = new Array();
    let produitsOffre;
    let categorie;
    let sousCategorie;


    $('option:checked[name=cat]').each(function(){
      categorie = $(this).val();
     });

     $('option:checked[name=sousCateg]').each(function(){
      sousCategorie = $(this).val();
     });

     $('option:checked[name=produit]').each(function(){
      var produit = $(this).val();
      produits.push(produit);
      })

      produitsOffre = produits[0];
      for( let i=1; i < produits.length; i++){
        produitsOffre += "æ"+produits[i];
      }
      formData.append("nom", $("#nom").val());
      formData.append("categorie", categorie);
      formData.append("sousCategorie", sousCategorie);
      formData.append("description", $("#description").val());
      formData.append("dure", $("#dure").val());
      formData.append("prix", $("#prix").val());
      formData.append("produit", produitsOffre);

      
      $.ajax({
        type: 'POST',
        data:formData,
        url: '/addOffre',
        contentType: false,
        processData: false,
        success: function (data) {
          if (data == "done") {
            var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function () {
              x.className = x.className.replace("show", "");
            }, 3000);
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          }
        },
        error: function (data) {
          var x = document.getElementById("snackbarError");
          x.className = "show";
          setTimeout(function () {
            x.className = x.className.replace("show", "");
          }, 2000);
        }});
  });


  var readURL = function (input) {
    var file;
    var len = input.files.length;
    
    for(let i=0;i<len;i++){ 
      if (len && input.files[i]) {
    var reader = new FileReader();
        reader.onload = function (e) {
          $("#sliderImage").append(" <img id='image"+numberIMager+"' style='width:100px;height:100px'>");
          $('#image'+numberIMager).attr('src', e.target.result);
          file = document.getElementById("pictureFile").files[i];
          formData.append("post_file", file);
          numberIMager++;
        }
        reader.readAsDataURL(input.files[i]);
      }
    }
  }
  $("#pictureFile").change(function(){
    readURL(this);
  });
});



function ApercuPhoto(id){
  $.post("SelectPhoto",
      {idOffre : id,
  },
  function (data, status) {
    
    if (data != 'error') {

      let caroussel = '<div class="carousel-inner">'
      for(let i =0; i< data.length; i++){ 
        if(i == 0){
          caroussel += ('<div class="carousel-item active"><button onclick="SupPhoto('+data[i].id+')" style="width: 100%;"><img style="width:640px;height:360px;" class="d-block w-100" src="images/offre/'+data[i].nom+'" ></button></div>');
        }else{
          caroussel += ('<div class="carousel-item "><button onclick="SupPhoto('+data[i].id+')" style="width: 100%;"><img style="width:640px;height:360px;" class="d-block w-100" src="images/offre/'+data[i].nom+'" ></button></div>');
        }
      }
      caroussel += '</div>' 
      $("#photo").replaceWith(caroussel);
      $("#ajouterphoto").replaceWith('<input type="file" accept="image/*" id="pictureFileAdd" name="pictureFileAdd" onchange="ajouterPhoto2('+id+')" multiple><br/><button  class="btn btn-success mr-2" onclick="ajouterPhoto('+id+')">Confirmer</button>');
      // 
    } 
  });
}
function div(idOffre,idProd){
  swal({
    title: "êtes vous sure ?",
    text: "vous voulez vraiment supprimer ce produit !",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      $.post("deletProduitOffre", {
          idOffre : idOffre,
          idProd : idProd,
        },
        function (data, status) {
          if (data == 'done') {
            swal("Ce produit a été bien supprimé !", {
              icon: "success",
            });
            $("#prod"+idOffre+idProd).remove();
          } else {
            swal("Ce produit n'a été supprimé !", {
              icon: "error",
            });
          }
        });
      setTimeout(function () {
        window.location.reload();
      }, 2000)
    } else {
      swal("Ce produit n'a pas été supprimé");
    }
  });
}



function alertSupp(id) {
  swal({
      title: "êtes vous sure ?",
      text: "vous voulez vraiment supprimer cet Offre !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        let idutilisateur = id;
        $.post("deleteOffre", {
            idOffre : id,
          },
          function (data, status) {
            if (data == 'done') {
              swal("Cet offre a été bien supprimé !", {
                icon: "success",
              });
            } else {
              swal("Cet offre n'a été supprimé !", {
                icon: "error",
              });
            }
          });
        setTimeout(function () {
          window.location.reload();
        }, 2000)
      } else {
        swal("Cet employe n'a pas été supprimé");
      }
    });
}


function SupPhoto(id){
  swal({
    title: "êtes vous sure ?",
    text: "vous voulez vraiment supprimer cette photo !",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      let idutilisateur = id;
      $.post("supprimerPhoto", {
          id : id,
        },
        function (data, status) {
          if (data == 'done') {
            swal("cette photo a été bien supprimée !", {
              icon: "success",
            });
          } else {
            swal("cette photo n'a été supprimée !", {
              icon: "error",
            });
          }
        });
      setTimeout(function () {
        window.location.reload();
      }, 2000)
    } else {
      swal("Cette photo n'a pas été supprimée");
    }
  });
}


function ajouterPhoto(id){

  formData2.append("idOffre",id);
  $.ajax({
    type: 'POST',
    data:formData2,
    url: '/addPhoto',
    contentType: false,
    processData: false,
    success: function (data) {
      if (data == "done") {
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function () {
          x.className = x.className.replace("show", "");
        }, 3000);
        setTimeout(function () {
          window.location.reload();
        }, 2000)
      }
    },
    error: function (data) {
      var x = document.getElementById("snackbarError");
      x.className = "show";
      setTimeout(function () {
        x.className = x.className.replace("show", "");
      }, 2000);
    }});
}




function alertMod(id) {
    let produits = new Array();
    let produitsOffre;
// console.log("aaaaaaaaaaaaaaaaa  "+categorieModif)
// console.log("aaaaaaaaaaaaaaaaa  "+sousCategorieModif)
    if(categorieModif == ''){
      $('option:checked[name=cate'+id+']').each(function(){
        categorieModif = $(this).val();
      });
    }

    if(sousCategorieModif == ''){
      $('option:checked[name=sousCat'+id+']').each(function(){
        sousCategorieModif = $(this).val();
      });
    }

    $('option:checked[name=produit'+id+']').each(function(){
      var produit = $(this).val();
      produits.push(produit);
      });console.log('produits')
      
      produitsOffre = produits[0];
      for( let i=1; i<produits.length; i++){
        produitsOffre += "æ"+produits[i];
      }

  console.log(id)
  console.log($('#nomModif'+id).html())
  console.log($('#produit'+id).html())
  console.log($('#description'+id).html())
  console.log($('#prix'+id).html())
  console.log(categorieModif)
  console.log(sousCategorieModif)
  console.log(produitsOffre)
      
  swal({
      title: "vous êtes sure?",
      text: "vous voulez vraiment modifier les informations de cette offre?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((modifier) => {
      if (modifier) {
        $.post("modifierOffre", {
            id: id,
            nom: $('#nomModif'+id).html(),
            produit : $('#produit'+id).html(),
            description: $('#description'+id).html(),
            prix: $('#prix'+id).html(),
            categorie: categorieModif,
            sousCategorie: sousCategorieModif,
            produitsOffre: produitsOffre,
            dure : $('#dure'+id).html(),
          },

          function (data, status) {
            if (data == 'done') {
              swal("Les informations sont bien modifiées !", {
                icon: "success",
              });
            } else {
              swal("Erreur, les informations ont pas été modifiées !", {
                icon: "error",
              });
            }
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          });

      }
    }
    );
}

function recupereCat(id){
  $('option:checked[name=cate'+id+']').each(function(){
    categorieModif = $(this).val();
   });

   $('option:checked[name=sous'+id+']').each(function(){
    sousCategorieModif = $(this).val();
   });
   
  //  console.log("recupereSousCat " +sousCategorieModif)
  //  console.log("recupereCat "+categorieModif)
}

function recupereSousCat(id){ 
  $('option:checked[name=sous'+id+']').each(function(){
    sousCategorieModif = $(this).val();
   });
  }


function selCatModif(id) {
  var categorie = $('#categorieModif').val();
    $.post("selectSousCat", {
         categorie : categorie,
      },
      function (data, status) {
        if (data != 'error') {
          let toReplac = '<div class="col-sm-3"  id="modif'+id+'"><select class="chercheBarDropDown form-control" onchange="recupereSousCat('+id+')" style="width: auto;">'; 
          for(let i=0; i<data.length; i++){ 
              toReplac+= '<option value='+data[i].nom+' name="sous'+id+'"> '+data[i].nom+'</option> ';
          }
          toReplac+= '</select></div>';
          $("#modif"+id).replaceWith (toReplac);
          recupereSousCat(id)
        } 
      });
}