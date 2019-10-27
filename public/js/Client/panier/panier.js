/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function afficherPanier() {
  $.post("panier",
    function (data, status) {
      $('.panier-content').empty();
      $('#pixTotal prix').empty();
      $('.commande').empty();
      if (data == 'error') {
        $('.panier-content').append("<li class='text-center'><h5>Probleme de connection</h5></li>");
      } else if (data == 'notConnected') {
        $('.panier-content').append("<li class='text-center'><h5>Vous etez pas connectez !!</h5></li>");
      }
      else {
        if (data.commandes.length == 0) {
          $('.panier-content').append("<li class='text-center'><h5>Votre panier est vide</h5></li>");
        }
        else {
          data.commandes.forEach(element => {
            $('.panier-content').append("<li id='item" + element.id + "'><img src='images/offre/" + element.image + "' alt='image' style='vertical-align: middle; width: 40px; height: 40px;'>  " + element.nom + "  <b> <prix>" + element.prix + "</prix>" + data.devis + "</b><span style='float: right;cursor: pointer' onclick='suppItem(" + element.id + "," + parseFloat(element.prix) + "," + element.idCommande + "," + data.commandes[0].prixTotal + ")'><svg viewBox='0 0 12 12' width='12px' height='12px'><line stroke='black' x1='11.75' y1='0.25' x2='0.25' y2='11.75'></line><line stroke='black' x1='11.75' y1='11.75' x2='0.25' y2='0.25'></line></svg></span></li>");
          });
          $('.panier-content').append("<li class='commande text-center'></li>");
          $('#pixTotal prix').append(data.commandes[0].prixTotal + " " + data.devis);
          $('.commande').append("<h4><a href='/lancerCommande' target='_blank'>Lancer la commande</a></h4>");
        }
      }
    });
  document.getElementById("myDropdown").classList.toggle("show");
}



// fonction pour supprimer un item du panier
function suppItem(id, prix, idCmd, prixTotal) {
  swal({
    title: "êtes vous sure ?",
    text: "vous voulez vraiment supprimer cet article !",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) => {
      if (willDelete) {
        $.post("deleteItem", {
          id,
          prix,
          idCmd,
          prixTotal,
        },
          function (data, status) {
            if (data == 'done') {
              $('#pixTotal prix').text(parseFloat($('#pixTotal prix').text()) - parseFloat($('#item' + id + ' prix').text()));
              $('#item' + id).remove();
              swal("Cet article a été bien supprimé !", {
                icon: "success",
              });
            } else {
              swal("Cet article n'a pas été supprimé !", {
                icon: "error",
              });
            }
          });
      } else {
        swal("Cet article n'a pas été supprimé");
      }
    });
}


//fonction pour fermer le panier 
function fermerPanier() {
  document.getElementById("myDropdown").classList.toggle("show");
}


//fonction pour ajouter un item
function addItem(id, prix) {
  $.post("addItem", {
    id,
    prix: parseFloat(prix),
  },
    function (data, status) {
      if (data == 'error') {
        swal("Cet article n'a pas été ajouté !", {
          icon: "error",
        });
      } else if (data == 'notConnected') {
        swal("Vous etes pas connecté !", {
          icon: "error",
        });
      } else if (data == 'done') {
        swal("Cet article a été bien ajouté !", {
          icon: "success",
        });
      }
    });
}


// function getNumberOfItem() {
//   $.get("getNumberOfItem", {}, function (data, status) {
//     if (status == "success") {
//       $('#numberOfItem').text(data.commandes.length);
//     }
//   });
// }
