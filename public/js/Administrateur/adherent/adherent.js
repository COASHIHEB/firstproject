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
function alertMod(val) {
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