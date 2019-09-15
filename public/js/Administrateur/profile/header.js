/************************fin pagination, serach **********************/

$.get("getUtilisateur", {},
  function (data, status) {
    if (status == "success") {
      $("#nom").val(data.nom);
      $("#nomUser").text(data.nom);
      $("#prenom").val(data.prenom);
      $("#email").val(data.email);
      $("#numTel").val(data.numTel);
      $("#adresse").val(data.adresse);
      $("#profilePicture").attr("src", "images/profilePicture/" + data.image);
    }
  });






/************************fonction de recuperation de tous les donnees de profile**********************/
