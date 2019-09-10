/************************pagination, serach **********************/
$(document).ready(function () {
    $('#tableau').DataTable({
      responsive: true,
      "lengthMenu": [10, 25, 50, 75, 100],
    });
  });

  function nbrComd(val) {
        $('#tableau'+val).DataTable({
          responsive: true,
          "lengthMenu": [10, 25, 50, 75, 100],
        });
  }
/************************fin pagination, serach **********************/

/******** Fonction pour modifier un client *********/
function alertMod(id) {
  swal({
      title: "vous êtes sure?",
      text: "vous voulez vraiment modifier les informations de ce client?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((modifier) => {
      if (modifier) {
        $.post("updateAdh", {
            id: id,
            points: $('#points' + id).html(),
            statut: $('#statut' + id).val(),
          },
          function (data, status) {
            if (data == 'done') {
              swal("Les informations sont bien modifiées !", {
                icon: "success",
              });
            } else {
              swal("Erreur, mal de modification!", {
                icon: "error",
              });
            }
            setTimeout(function () {
              window.location.reload();
            }, 2000)
          });

      }
    });
}



/******** Fonction pour supprimer un client *********/
function alertSupp(idUtil,idAdh) {
  swal({
      title: "êtes vous sure ?",
      text: "vous voulez vraiment supprimer ce client !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        $.post("deleteAdh", {
            idUtil,
            idAdh,
          },
          function (data, status) {
            if (data == 'done') {
              swal("Ce client a été bien supprimé !", {
                icon: "success",
              });
            } else {
              swal("Ce client n'a été supprimé !", {
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