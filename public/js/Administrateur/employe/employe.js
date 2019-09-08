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

/*********************Show password***************************/
$(document).ready(function () {
  $("#show_hide_password").on('click', function (event) {
    event.preventDefault();
    if ($('#show_hide_password input').attr("type") == "text") {
      $('#show_hide_password input').attr('type', 'password');
      $('#show_hide_password i').addClass("fa-eye-slash");
      $('#show_hide_password i').removeClass("fa-eye");
    } else if ($('#show_hide_password input').attr("type") == "password") {
      $('#show_hide_password input').attr('type', 'text');
      $('#show_hide_password i').removeClass("fa-eye-slash");
      $('#show_hide_password i').addClass("fa-eye");


    }
  });
});
/*********************Fin show password***************************/

/************************boutton annulé**********************/
function resetFileds() {
  document.getElementById('nomUtilisateur').value = null;
  document.getElementById('prenomUtilisateur').value = null;
  document.getElementById('pseudo').value = null;
  document.getElementById('mdp').value = null;
  document.getElementById('email').value = null;
  document.getElementById('tel').value = null;

}
/************************fin boutton annulé**********************/


/************************Ajouter utilisateur*********************/

$(document).ready(function () {
  $("#submit").click(function () {console.log("zzzzzzz")
    $.post("addUser", {
        nomUser: $("#nomUtilisateur").val(),
        prenomUser: $("#prenomUtilisateur").val(),
        password: $("#mdp").val(),
        type: $("#type").val(),
        email: $("#email").val(),
        tel: $("#tel").val(),
        adresse: $("#adresse").val(),
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
/************************fin Ajouter utilisateur*********************/


/************************aler supprimer employe**********************/
function alertSupp(id) {
  swal({
      title: "êtes vous sure ?",
      text: "vous voulez vraiment supprimer cet employe !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        let idutilisateur = id;
        $.post("deleteEmp", {
            idutilisateur
          },
          function (data, status) {
            if (data == 'done') {
              swal("Cet employe a été bien supprimé !", {
                icon: "success",
              });
            } else {
              swal("Cet employe n'a été supprimé !", {
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
/************************fin alert supprimer employe**********************/


/************************modifier employe**********************/
function alertMod(id) {
  swal({
      title: "vous êtes sure?",
      text: "vous voulez vraiment modifier les informations de cet employe?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((modifier) => {
      if (modifier) {
        $.post("modifierEmp", {
            id: id,
            nom: $('#nom' + id).html(),
            prenom: $('#prenom' + id).html(),
            pseudo: $('#pseudo' + id).html(),
            email: $('#mail' + id).html(),
            tel: $('#tel' + id).html(),
            code: $('#code' + id).html(),
            permis: $('#permis' + id).html(),
          },

          function (data, status) {
            if (data == 'done') {
              swal("Les informations sont bien modifiées !", {
                icon: "success",
              });
            } else {
              swal("Erreur, email ou code existe déjà !", {
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
/************************fin modifier employe**********************/