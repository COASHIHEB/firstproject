/************************fin pagination, serach **********************/

$.get("getUtilisateur", {},
  function (data, status) {
    if (status == "success") {
      $("#nom").val(data.nom);
      $("#nomUser").text(data.nom + " " + data.prenom);
      $("#nameSideBar").text(data.nom + " " + data.prenom);
      $("#statutSideBar").text(data.statut);
      $("#prenom").val(data.prenom);
      $("#email").val(data.email);
      $("#numTel").val(data.numTel);
      $("#adresse").val(data.adresse);
      $("#profilePicture").attr("src", "images/profilePicture/" + data.image);
      $("#profilePictureHeader").attr("src", "images/profilePicture/" + data.image);
      $("#profilePictureSideBar").attr("src", "images/profilePicture/" + data.image);
    }
  });






/************************fonction de recuperation de tous les donnees de profile**********************/
