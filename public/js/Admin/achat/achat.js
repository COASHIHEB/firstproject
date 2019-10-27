/************************pagination, serach **********************/
$(document).ready(function () {
  $('#tableAllAchats').DataTable({
    responsive: true,
    "lengthMenu": [10, 25, 50, 75, 100],
  });


  $('#tableRecentAchats').DataTable({
    responsive: true,
    "lengthMenu": [10, 25, 50, 75, 100],
  });
});
/************************fin pagination, serach **********************/

$(document).ready(function () {

  let firstOpenPage = true;
  getTableAllAchats();
});

/************************boutton annulé**********************/
function resetFileds() {
  document.getElementById('nom').value = null;
  document.getElementById('quantiteAchat').value = null;
  document.getElementById('minQuantite').value = null;
  document.getElementById('description').value = null;
  document.getElementById('dateExp').value = null;

}
/************************fin boutton annulé**********************/





/************************fonction de recuperation de tous les achats **********************/
function getTableAllAchats() {
  $.get("allAchat", {},
    function (data, status) {
      let divAllAchat;
      if (data.statut == "done") {
        data.allAchat.forEach(function (achat, index) {
          divAllAchat = '<tr><td class="text-center">' + (index + 1) + '</td><td contenteditable="true" class="text-center" id="nom' + achat.idAchat + '">' + achat.nom + '</td><td contenteditable="true" class="text-center" id="description' + achat.idAchat + '">' + achat.description + '</td><td contenteditable="true" class="text-center" id="quantiteAchat' + achat.idAchat + '">' + achat.quantiteAchat + '</td><td contenteditable="true" class="text-center" id="dateExp' + achat.idAchat + '">' + achat.dateExp + '</td><td contenteditable="true" class="text-center" id="dateAchat' + +achat.idAchat + '">' + achat.dateAchat + '</td><td class="text-center"><button class=" btn btn-danger btn-xs" onclick="alertSupp(' + achat.idAchat + ')"><span class="fa fa-trash"></span></button>&nbsp;&nbsp;<button class=" btn btn-success btn-xs" onclick="alertMod(' + achat.idAchat + ',' + achat.idProd + ')"><span class="fa fa-edit"></span></button></td></tr>';
          var table = $('#tableAllAchats').DataTable();
          table.row.add($(divAllAchat)).draw();
        });
        $('#tableRecentAchats').DataTable().clear().draw();
        getTableRecentAchats();

      }
    });
}
/************************fin fonction de recuperation de tous les achats**********************/


/************************fonction de recuperation de tous les recents achats **********************/

function getTableRecentAchats() {
  $.get("recentAchat", {},
    function (data, status) {
      let divRecentAchat;
      if (data.statut == "done") {
        data.recentAchat.forEach(function (achat, index) {
          divRecentAchat = '<tr><td class="text-center">' + index + '</td><td class="text-center">' + achat.nom + '</td><td contenteditable="true" class="text-center">' + achat.quantiteAchat + '</td><td class="text-center" >' + achat.dateAchat + '</td></tr>';
          var table = $('#tableRecentAchats').DataTable();
          table.row.add($(divRecentAchat)).draw();
        });
      }
    });
}
/************************fin fonction de recuperation de tous les recents achats**********************/










/************************Ajouter un achat *********************/


$(document).ready(function () {


  $("#submit").click(function () {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;


    let error = 0;
    if ($("#nom").val() == "") {
      $("#nom").addClass("is-invalid");
      $("#nomWarning").text("champs vide");
      $("#nom").focus();
      error = 1
    } else {
      $("#nom").removeClass("is-invalid");
      $("#nomWarning").text("");
    }
    if ($("#quantiteAchat").val() == "") {
      $("#quantiteAchat").addClass("is-invalid");
      $("#quantiteAchatWarning").text("champs vide");
      $("#quantiteAchat").focus();
      error = 1
    } else {
      $("#quantiteAchat").removeClass("is-invalid");
      $("#quantiteAchatWarning").text("");
    }
    if ($("#dateExp").val() == "") {
      $("#dateExp").addClass("is-invalid");
      $("#dateExpWarning").text("champs vide");
      $("#dateExpWarning").focus();
      error = 1
    } else if ($("#dateExp").val() <= today) {
      $("#dateExp").addClass("is-invalid");
      $("#dateExpWarning").text("date inferieur ------------");
      $("#dateExpWarning").focus();
      error = 1

    } else {
      $("#dateExp").removeClass("is-invalid");
      $("#dateExpWarning").text("");
    }


    if (error) return false



    $.post("addAchat", {
        nom: $("#nom").val(),
        quantiteAchat: $("#quantiteAchat").val(),
        minQuantite: $("#minQuantite").val(),
        description: $("#description").val(),
        dateExp: $("#dateExp").val(),
      },
      function (data, status) {
        if (data.statut == 'done') {

          var x = document.getElementById("snackbar");
          x.className = "show";


          $('#tableAllAchats').DataTable().clear().draw();
          getTableAllAchats();
          resetFileds();
          setTimeout(function () {
            x.className = x.className.replace("show", "");
          }, 3000);
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




/************************fin Ajouter achat*********************/


/************************aler supprimer achat **********************/
function alertSupp(id) {
  swal({
      title: "êtes vous sure ?",
      text: "vous voulez vraiment supprimer cet achat !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        let idAchat = id;
        $.post("deleteAchat", {
            idAchat
          },
          function (data, status) {
            if (data == 'done') {
              swal("Cet achat a été bien supprimé !", {
                icon: "success",
              });
              $('#tableAllAchats').DataTable().clear().draw();
              getTableAllAchats();

            } else {
              swal("Cet achat n'a été supprimé !", {
                icon: "error",
              });
            }
          });
      } else {
        swal("Cet achat n'a pas été supprimé");
      }
    });
}
/************************fin alert supprimer achat**********************/


/************************modifier employe**********************/
function alertMod(idAchat, idProd) {
  swal({
      title: "vous êtes sure?",
      text: "vous voulez vraiment modifier les informations de cet employe?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((modifier) => {
      if (modifier) {
        var nom = $('#nom' + idAchat).text().toString().replace(/^\s+/g, '')
        var description = $('#description' + idAchat).text().toString().replace(/^\s+/g, '')
        var quantiteAchat = $('#quantiteAchat' + idAchat).text().toString().replace(/^\s+/g, '')
        var dateExp = $('#dateExp' + idAchat).text().toString().replace(/^\s+/g, '')
        var dateAchat = $('#dateAchat' + idAchat).text().toString().replace(/^\s+/g, '')
        $.post("updateAchat", {
            idAchat: idAchat,
            idProd: idProd,
            nom: nom,
            description: description,
            quantiteAchat: quantiteAchat,
            dateExp: dateExp,
            dateAchat: dateAchat,
          },

          function (data, status) {
            if (data == 'done') {
              swal("Les informations sont bien modifiées !", {
                icon: "success",
              });
              $('#tableAllAchats').DataTable().clear().draw();
              getTableAllAchats();

            } else {
              swal("Erreur, pseudo ou code existe déjà !", {
                icon: "error",
              });
            }
          });

      }
    });
}
/************************fin modifier employe**********************/