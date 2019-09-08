$(document).ready(function () {

  let firstOpenPage = true;
  getTableAchats();
});

/*
        var table = $('#tableau').DataTable();
        table.row.add([
            index, achat.nom, '1', '1', '1', '1', '<button class=" btn btn-danger btn-xs" onclick="alertSupp(' + achat.idAchat + ')"><span class="fa fa-trash"></span></button><button class=" btn btn-success btn-xs" onclick="alertMod(' + achat.idAchat + ',' + achat.idProd + ')"><span class="fa fa-edit"></span></button>'
          ]).draw();
*/

// fonction de recuperation de tous les achats
function getTableAchats() {
  $.post("allAchat", {},
    function (data, status) {
      let divAllAchat;
      if (data.statut == "done") {
        allAchat = data.allAchat;
        allAchat.forEach(function (achat, index) {
          divAllAchat = '<tr><td class="text-center">' + index + '</td><td contenteditable="true" class="text-center" id="nom' + achat.idAchat + '">' + achat.nom + '</td><td contenteditable="true" class="text-center" id="description' + achat.idAchat + '">' + achat.description + '</td><td contenteditable="true" class="text-center" id="quantiteAchat' + achat.idAchat + '">' + achat.quantiteAchat + '</td><td contenteditable="true" class="text-center" id="dateExp' + achat.idAchat + '">' + achat.dateExp + '</td><td contenteditable="true" class="text-center" id="dateAchat' + +achat.idAchat + '">' + achat.dateAchat + '</td><td class="text-center"><button class=" btn btn-danger btn-xs" onclick="alertSupp(' + achat.idAchat + ')"><span class="fa fa-trash"></span></button><button class=" btn btn-success btn-xs" onclick="alertMod(' + achat.idAchat + ',' + achat.idProd + ')"><span class="fa fa-edit"></span></button></td></tr>';
          var table = $('#tableau').DataTable();
          table.row.add($(divAllAchat)).draw();
        });


        // allAchat.forEach(function (achat, index) {
        //   var table = $('#tableau').DataTable();
        //   table.row.add([
        //     index, ' <td type="text"  class="text-center" id="' + index + '">' + index + '</td>', achat.description, achat.quantiteAchat, achat.dateExp, achat.dateAchat, '<button class=" btn btn-danger btn-xs" onclick="alertSupp(' + achat.idAchat + ')"><span class="fa fa-trash"></span></button><button class=" btn btn-success btn-xs" onclick="alertMod(' + achat.idAchat + ',' + achat.idProd + ')"><span class="fa fa-edit"></span></button>'
        //   ]).node().id = 'tr' + achat.idAchat;
        //   table.draw(false);
        // });



      }
      // if ((data == 'done') && (!firstOpenPage)) {
      //   var x = document.getElementById("snackbar");
      //   x.className = "show";
      //   setTimeout(function () {
      //     x.className = x.className.replace("show", "");
      //   }, 3000);
      // } else {
      //   var x = document.getElementById("snackbarError");
      //   x.className = "show";
      //   setTimeout(function () {
      //     x.className = x.className.replace("show", "");
      //   }, 2000);
      // }
      // firstOpenPage = false;
    });
}
// fin fonction de recuperation de tous les achats

/************************pagination, serach **********************/
$(document).ready(function () {
  $('#tableau').DataTable({
    responsive: true,
    "lengthMenu": [10, 25, 50, 75, 100],
  });


  $('#tableau2').DataTable({
    responsive: true,
    "lengthMenu": [10, 25, 50, 75, 100],
  });
});
/************************fin pagination, serach **********************/




/************************boutton annulé**********************/
function resetFileds() {
  document.getElementById('nom').value = null;
  document.getElementById('quantiteAchat').value = null;
  document.getElementById('minQuantite').value = null;
  document.getElementById('description').value = null;
  document.getElementById('dateExp').value = null;

}
/************************fin boutton annulé**********************/


/************************Ajouter un achat *********************/
/*
$(document).ready(function () {
  $("#submit").click(function () {
    $.post("addAchat", {
        nom: $("#nom").val(),
        quantiteAchat: $("#quantiteAchat").val(),
        minQuantite: $("#minQuantite").val(),
        description: $("#description").val(),
        dateExp: $("#dateExp").val(),
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

*/

$(document).ready(function () {


  $("#submit").click(function () {
    if ($("#nom").val() == "") {
      $("#nom").focus();
      return false;
    } else if ($("#quantiteAchat").val() == "") {
      $("#quantiteAchat").focus();
      return false;
    } else if ($("#minQuantite").val() == "") {
      $("#minQuantite").focus();
      return false;
    } else if ($("#description").val() == "") {
      $("#description").focus();
      return false;
    } else if ($("#dateExp").val() == "") {
      $("#dateExp").focus();
      return false;
    }





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


          $('#tableau').DataTable().clear().draw();
          getTableAchats();
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

/*
    $.ajax({
        url: '/addAchat',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
          nom: $("#nom").val(),
          quantiteAchat: $("#quantiteAchat").val(),
          minQuantite: $("#minQuantite").val(),
          description: $("#description").val(),
          dateExp: $("#dateExp").val(),
        })
      })
      .done(function (data) {
        if (data.status == 'error') {
          var x = document.getElementById("snackbarError");
          x.className = "show";
          x.className = x.className.replace("show", "");
        } else {
          var $row = $('<tr>' +
            '<td class="text-center"> New </td>' +
            '<td id="nom' + data.idAchat + '" contenteditable="true" class="text-center"> ' + $("#nom").val() + ' </td>' +
            '<td id="quantiteAchat' + data.idAchat + '" contenteditable="true" class="text-center"> ' + $("#quantiteAchat").val() + ' </td>' +
            '<td id="minQuantite' + data.idAchat + '" contenteditable="true" class="text-center"> ' + $("#minQuantite").val() + '</td>' +
            '<td id="description' + data.idAchat + '" contenteditable="true" class="text-center"> ' + $("#description").val() + '</td>' +
            '<td id="dateExp' + data.idAchat + '" contenteditable="true" class="text-center"> ' + $("#dateExp").val() + ' </td>' +
            '<td  class="text-center">' +
            '<button class=" btn btn-danger btn-xs" onclick="alertSupp(' + data.idAchat + ')">' +
            '<span class="fa fa-trash"></span>' +
            '</button>' +
            '<button class=" btn btn-success btn-xs" onclick = "alertMod(' + data.idAchat + ')">' +
            '<span class="fa fa-edit"></span>' +
            '</button > ' +
            ' </td>' +
            '</tr>');
          $("#tableau").prepend($row);

          Swal.fire({
            type: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
      .fail(function (err) {
        Swal.fire({
          position: 'top-end',
          type: 'error',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        })

      })*/



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
              $('#tableau').DataTable().clear().draw();
              getTableAchats();

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
            alert(data)
            if (data == 'done') {
              swal("Les informations sont bien modifiées !", {
                icon: "success",
              });
              $('#tableau').DataTable().clear().draw();
              getTableAchats();

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