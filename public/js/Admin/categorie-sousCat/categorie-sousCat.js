let x = 0;

$(document).ready(function () {

  $('#tableau2').DataTable({
    responsive: true,
    "lengthMenu": [10, 25, 50, 75, 100],
  });
});
/*******************Ajouter ligne***********************/
$(document).ready(function() {

  let wrapper   		= $("#tab_logic2"); //Fields wrapper
  let add_button      = $("#add_row2"); //Add button ID
  let toDelet = $("#toDelet2");
	
	$(add_button).click(function(e){ //on add input button click
    e.preventDefault();
			x++; //text box increment
      $(wrapper).after('<div class="row"><label for="nom" class="col-sm-3 col-form-label">Nom sous catégorie</label><div class="col-sm-7"><input type="text"  class="form-control" id="nomSC'+x+'" placeholder="Veuillez saisir le nom " required></div><div class="col-sm-0.5 align-middle" id='+x+'><a id="delete_row2" > <label class="badge badge-danger" style="margin-top: 7px;"><span class="fa fa-minus"></label></a>&nbsp;</div></div>')
	});
	
  $(toDelet).on("click","#delete_row2", function(e){ //user click on remove text
    e.preventDefault();
    $(this).parent('div').parent('div').remove(); 
    x--;
	})
});

/*******************Fin ajouter ligne***********************/
$(document).ready(function() {
    $("#submit").click(function(){
      let isMissiedFiels = true;
      let sousCats;
      let compte = 0;

      sousCats = ($('#nomSC0').val())
      for( let i=1; i <= x; i++){
        sousCats += "æ"+($('#nomSC'+i).val());
        }

      for( let j=0;  j<= x; j++){
        if($('#nomSC'+j).val() != ''){   
          compte++;
        }
      }
      if(compte == (x+1)){
        isMissiedFiels = false;
      }

    if(isMissiedFiels == false){
        $.post("addCategorie",{
          sousCats: sousCats,
          categ : $('#nomCat').val(),
        },
          function(data, status){
          if(data == "done"){
              var k = document.getElementById("snackbar");
              k.className = "show";
              setTimeout(function(){ x.className = k.className.replace("show", ""); }, 3000);  
              setTimeout(function(){ window.location.reload();}, 2000)
          }
          else{
              var k = document.getElementById("snackbarError");
              k.className = "show";
              setTimeout(function(){ k.className = k.className.replace("show", ""); }, 3000);  
          }
        }
        )
        
      }

      if(isMissiedFiels == true){
        var k = document.getElementById("snackbarError");
        k.className = "show";
        setTimeout(function(){ k.className = k.className.replace("show", ""); }, 3000);  
      }
    })
})





function div(idSousCat){
  swal({
    title: "êtes vous sure ?",
    text: "Les offres de cette sous catégorie seront aussi supprimée, vous voulez vraiment continuer la suppression ?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      $.post("deletSousCat", {
        idSousCat : idSousCat,
        },
        function (data, status) {
          if (data == 'done') {
            swal("Cette sous catégorie a été bien supprimée !", {
              icon: "success",
            });
            $("#prod"+idOffre+idProd).remove();
          } else {
            swal("Cette sous catégorie n'a été supprimée !", {
              icon: "error",
            });
          }
        });
      setTimeout(function () {
        window.location.reload();
      }, 2000)
    } else {
      swal("Cette sous catégorie n'a pas été supprimée");
    }
  });
}






function alertSupp(idCat) {
  swal({
      title: "êtes vous sure ?",
      text: "Les offres de cette catégorie seront aussi supprimée, vous voulez vraiment continuer la suppression ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        $.post("deleteCategorie", {
          idCat : idCat,
          },
          function (data, status) {
            if (data == 'done') {
              swal("Cette catégorie a été bien supprimée !", {
                icon: "success",
              });
            } else {
              swal("Cette catégorie n'a été supprimée !", {
                icon: "error",
              });
            }
          });
        setTimeout(function () {
          window.location.reload();
        }, 2000)
      } else {
        swal("Cette catégorie n'a pas été supprimée");
      }
    });
  }



    function ModifierSousCat(idSousCat) {
      swal({
          title: "êtes vous sure ?",
          text: "vous voulez vraiment modifier le nom de cette sous catégorie?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            $.post("ModifierSousCat", {
              nom: document.getElementById('sc'+idSousCat).innerHTML,
              idSousCat : idSousCat,
              },
              function (data, status) {
                if (data == 'done') {
                  swal("Le nom de cette sous catégorie a été bien modifiée !", {
                    icon: "success",
                  });
                } else {
                  swal("Le nom de cette sous catégorie n'a pas été  modifiée !", {
                    icon: "error",
                  });
                }
              });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          } else {
            swal("Le nom de cette sous catégorie n'a pas été  modifiée");
          }
        });
  }

  function alertMod(idCat) {
    swal({
        title: "êtes vous sure ?",
        text: "vous voulez vraiment modifier le nom de cette catégorie?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          $.post("ModifierCat", {
            nom: document.getElementById('categ'+idCat).innerHTML,
            idCat : idCat,
            },
            function (data, status) {
              if (data == 'done') {
                swal("Le nom de cette catégorie a été bien modifiée !", {
                  icon: "success",
                });
              } else {
                swal("Le nom de cette catégorie n'a pas été  modifiée !", {
                  icon: "error",
                });
              }
            });
          setTimeout(function () {
            window.location.reload();
          }, 2000)
        } else {
          swal("Le nom de cette sous catégorie n'a pas été  modifiée");
        }
      });
    }






    function affiche(id){
      $(document).ready(function(){
        $('#'+id).after('<tr id="ligne'+id+'"><td></td><td class="text-center" colspan="2" ><label style="font-family: Poppins,sans-serif;font-weight: 500;">Sous catégorie:&nbsp;&nbsp;&nbsp;<label><input type="text" class="form-control" id="sousCategorie'+id+'" name="sousCategorie" style="width: 90%"/></td><td class="text-center" ><button class=" btn btn-success btn-xs" onclick="confirmer('+id+')">Confirmer</button></tr>');
          $('#afficher'+id).hide();
          $('#cache'+id).show();
          
     });
    }
    
    function cache(id){
      $(document).ready(function(){
          $('#ligne'+id).slideToggle("fast");
          $('#cache'+id).hide();
          $('#afficher'+id).show();
    });
    }


    function confirmer(idCat) {
      swal({
          title: "êtes vous sure ?",
          text: "vous voulez vraiment ajouter cette catégorie?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            $.post("addSousCat", {
              nom: $('#sousCategorie'+idCat).val(),
              idCat : idCat,
              },
              function (data, status) {
                if (data == 'done') {
                  swal("Cette sous catégorie est bien ajoutée !", {
                    icon: "success",
                  });
                } else {
                  swal("Cette sous catégorie n'a pas été ajoutée !", {
                    icon: "error",
                  });
                }
              });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          } else {
            swal("Cette sous catégorie n'a pas été ajoutée");
          }
        });
      }