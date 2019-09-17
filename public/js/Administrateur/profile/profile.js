/************************fin pagination, serach **********************/

$(document).ready(function () {
  //getUtilisateur();



});






/************************fonction de recuperation de tous les donnees de profile**********************/
// function getUtilisateur() {
//   $.get("getUtilisateur", {},
//     function (data, status) {
//       if (status == "success") {
//         $("#nom").val(data.nom);
//         $("#prenom").val(data.prenom);
//         $("#email").val(data.email);
//         $("#numTel").val(data.numTel);
//         $("#adresse").val(data.adresse);
//         $("#profilePicture").attr("src", "images/profilePicture/" + data.image);
//       }
//     });
// }
/************************fin fonction de recuperation de tous les donnees de profile**********************/




$(document).ready(function () {
  var readURL = function (input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#newImage').attr('src', e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  $(".file-upload").on('change', function () {
    readURL(this);
    $("#modalNewPicture").modal("show")

  });

  $("#imageButton").on('click', function () {
    $(".file-upload").click();

  });
});

function updatePictureFunction() {
  var formData = new FormData();
  var file = document.getElementById("pictureFile").files[0];
  formData.append("post_file", file);
  $.ajax({
    type: 'POST',
    data: formData,
    url: '/updatePictureProfile',
    contentType: false,
    processData: false,
    success: function (data) {
      if (data.statut == "done") {
        $("#profilePicture").attr("src", "images/profilePicture/" + data.image);
      }
    },
    error: function (data) {
      console.log("error")
    }
  });




}





$(document).ready(function () {
  /************************ modifier le profile  *********************/
  $("#submitProfileUtilisateur").click(function () {
    let error = 0;
    if ($("#nom").val() == "") {
      $("#nom").addClass("is-invalid");
      $("#nomWarning").text("mot de passe vide");
      $("#nom").focus();
      error = 1;
    } else {
      $("#nom").removeClass("is-invalid");
      $("#nomWarning").text("");
    }
    if ($("#prenom").val() == "") {
      $("#prenom").addClass("is-invalid");
      $("#prenomWarning").text("mot de passe vide");
      $("#prenom").focus();
      error = 1;
    } else {
      $("#prenom").removeClass("is-invalid");
      $("#prenommWarning").text("");
    }
    if ($("#numTel").val() == "") {
      $("#numTel").addClass("is-invalid");
      $("#numTelWarning").text("mot de passe vide");
      $("#numTel").focus();
      error = 1;
    } else {
      $("#numTel").removeClass("is-invalid");
      $("#numTelWarning").text("");
    }
    if ($("#adresse").val() == "") {
      $("#adresse").addClass("is-invalid");
      $("#adresseWarning").text("mot de passe vide");
      $("#adresse").focus();
      error = 1;
    } else {
      $("#adresse").removeClass("is-invalid");
      $("#adresseWarning").text("");
    }
    if (error) return false

    $.post("updateUtilisateur", {
      nom: $("#nom").val(),
      prenom: $("#prenom").val(),
      numTel: $("#numTel").val(),
      adresse: $("#adresse").val(),
    },
      function (data, status) {
        if (data == 'done') {
          var x = document.getElementById("snackbar");
          x.className = "show";
          getUtilisateur();
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
  /************************ Fin modifier le profile  *********************/

  /************************ modifier le mot de passe  *********************/

  $("#submitPasswordUtilisateur").click(function () {

    let error = 0;
    if ($("#oldPassword").val() == "") {
      $("#oldPassword").addClass("is-invalid");
      $("#oldPasswordWarning").text("mot de passe vide");
      $("#oldPassword").focus();
      error = 1;
    } else {
      $("#oldPassword").removeClass("is-invalid");
      $("#oldPasswordWarning").text("");
    }



    if ($("#newPassword").val() == "") {
      $("#newPassword").addClass("is-invalid");
      $("#newPasswordWarning").text("mot de passe vide");
      $("#newPassword").focus();
      error = 1;

    } else {
      $("#newPassword").removeClass("is-invalid");
      $("#newPasswordWarning").text("");
    }



    if ($("#confirmePassword").val() == "") {
      $("#confirmePassword").addClass("is-invalid");
      $("#confirmePasswordWarning").text("mot de passe vide");
      $("#confirmePassword").focus();
      error = 1;
    } else {
      $("#confirmePassword").removeClass("is-invalid");
      $("#confirmePasswordWarning").text("");
    }

    if (error) return false;

    if ($("#newPassword").val() != $("#confirmePassword").val()) {
      $("#confirmePassword").addClass("is-invalid");
      $("#confirmePasswordWarning").text("confirme mot de passe n'est pas identique");
      $("#confirmePassword").focus();
      return false

    } else {
      $("#confirmePassword").removeClass("is-invalid");
      $("#confirmePasswordWarning").text("");
    }



    $.post("updatePassword", {
      oldPassword: $("#oldPassword").val(),
      newPassword: $("#newPassword").val(),
      confirmePassword: $("#confirmePassword").val(),
    },
      function (data, status) {
        if (data == 'done') {
          $("#oldPassword").removeClass("is-invalid");
          $("#oldPasswordWarning").text("");
          var x = document.getElementById("snackbar");
          x.className = "show";
          setTimeout(function () {
            x.className = x.className.replace("show", "");
            window.location = document.getElementById('logout').href;
          }, 3000);
        } else if (data == 'passwordInvalide') {
          $("#oldPassword").addClass("is-invalid");
          $("#oldPasswordWarning").text("mot de passe non valide");
          $("#oldPassword").focus();
        } else {
          var x = document.getElementById("snackbarError");
          x.className = "show";
          setTimeout(function () {
            x.className = x.className.replace("show", "");
          }, 2000);
        }

      });

  });
  /************************ Fin modifier le mot de passe  *********************/


});