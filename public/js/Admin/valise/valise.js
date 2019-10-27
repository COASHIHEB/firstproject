$(document).ready(function () {

  $('#tableau1').DataTable({
    responsive: true,
    "lengthMenu": [10, 25, 50, 75, 100],
  });
});

$(document).ready(function () {
        $("#submit").click(function () {
        let produitsOffre;
        let produits = [];
            $('option:checked[name=produit]').each(function(){
            var produit = $(this).val();
            produits.push(produit);
            })
        
            produitsOffre = produits[0];
            for( let i=1; i < produits.length; i++){
                produitsOffre += "æ"+produits[i];
            } console.log(produitsOffre)

            $.post("addValise", {
                produit : produitsOffre, 
            },
            function (data, status) {
                if (data == 'done') {
                var x = document.getElementById("snackbar");
                x.className = "show";
                setTimeout(function () {
                    x.className = x.className.replace("show", "");
                }, 3000);
                setTimeout(function () {
                    window.location.reload();
                }, 2000)
                } else {
                var x = document.getElementById("snackbarError");
                x.className = "show";
                setTimeout(function () {
                    x.className = x.className.replace("show", "");
                }, 2000);
                }
            });
        });
    });





    function div(produit, employe){
        swal({
          title: "êtes vous sure ?",
          text: " Vous voulez vraiment supprimer ce produit pour cet employé ?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            $.post("deletProduit", {
              produit: produit,
              employe: employe,
              },
              function (data, status) {
                if (data == 'done') {
                  swal("Cet produit a été bien supprimée !", {
                    icon: "success",
                  });
                  $("#prod"+produit+employe).remove();
                } else {
                  swal("Cet produit n'a été supprimée !", {
                    icon: "error",
                  });
                }
              });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          } else {
            swal("Ce produit n'a pas été supprimée");
          }
        });
      }




      function ajoutQte(produit, employe){
        swal({
          title: "êtes vous sure ?",
          text: " Vous voulez vraiment modifier ce produit pour cet employé ?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            $.post("ajoutQte", {
              qte: $("#quantity").val(),
              produit: produit,
              employe: employe,
              },
              function (data, status) {
                if (data == 'done') {
                  swal("Cette quantité de produit a été bien modifiée !", {
                    icon: "success",
                  });
                } else {
                  swal("Cette quantité de produit n'a pas été modifiée !", {
                    icon: "error",
                  });
                }
              });
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          } else {
            swal("Cette quantité de produit n'a pas été modifiée ");
          }
        });
      }



      function affiche(employe){
        // import ('../../fSelect.js') 
        // $(document).ready(function(){
          $(document).ready(function() {
            import ('../../fSelect.js')
            // $('#test1').fSelect();
            function refrechSelect(){
              $('.test').fSelect();
            }
          $.post("afficheProd", {
            employe:employe
          },
            function (data, status) {
              if (data) {
                refrechSelect();
                let produit = '<tr id="ligne'+employe+'"><td></td><td></td><td><label for="nom" class="col-sm-6 col-form-label">Produits</label><select class="test" multiple="multiple" >'
                for(let i=1; i<data.length; i++){
                  produit +=' <option value='+data[i]+' name=produit>'+data[i]+'</option>'
                }
                produit += '<td class="text-center" ><button class=" btn btn-success btn-xs" onclick="confirmer('+employe+')">Confirmer</button></tr>';
                $('#'+employe).after(produit);
                
                $('#afficher'+employe).hide();
                $('#cache'+employe).show();
              // })
              } else {
                swal("Cette quantité de produit n'a pas été modifiée !", {
                  icon: "error",
                });
              }
            });
          }); 
      }

    


      
      function cache(employe){
        $(document).ready(function(){
            $('#ligne'+employe).slideToggle("fast");
            $('#cache'+employe).hide();
            $('#afficher'+employe).show();
      });
      }