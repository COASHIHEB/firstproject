
/************************fin pagination, serach **********************/
function initMap() {
  testMap = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 34.8274, lng: -1.5283 },
    zoom: 10
  });
}


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







var socket = io.connect('http://192.168.1.55:8083');



socket.on('getLocation', function (from) {
  // il faut mettre un ip qui se change pas 
  var successHandler = function (position) {
    $.post("changeLocation", {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
      from: from,
    },
      function (data, status) {
        if (data == 'done') {
          console.log("3# change locaiton done");
        }
        else alert("change locaiton error");
      });
  }

  var errorHandler = function (errorObj) {
    alert("vouliez activer la le GPS");
  };

  navigator.geolocation.getCurrentPosition(
    successHandler, errorHandler,
    { enableHighAccuracy: true, maximumAge: 10000 });
});


socket.on('notifieEmployeNouvelleCommandeEstInserer', function (data) {
  console.log("socket nofier employé")
  // on recupere l'id employé et on verifie si il est le meme id pour la commande qui existe dans le data
  $.post("verifyIdEmploye", {
    idCommande: data[0].idCommande,
  },
    function (donnee, status) {
      // si la commande est effectué a cet employe
      if (donnee == 'done') {
        location.reload();
      }
    });


});

var dateTime = moment().tz("Africa/Casablanca").format("YYYY-MM-DD HH:mm:ss");


// ######################################
function accepterUneNouvelleCommande(idCommande) {
  var dateFinRealisation;
  var employeAdresse;
  let longitude;
  let latitude;
  console.log(dateTime)

  //on va recuperer l'adresse de la dernier commande pour l'employé et si elle est moins que l'heure actuelle on recupere la poistion de l'employé
  $.get("getLastCommandeEmploye",
    function (donnee, status) {
      if (donnee.statut == 'done') {

        if (donnee.dateFinRealisation && dateTime < moment(donnee.dateFinRealisation).format("YYYY-MM-DD HH:mm:ss")) {
          console.log(donnee)
          employeAdresse = donnee.adressPourSonDernierClient;
          dateTime = donnee.dateFinRealisation;
        }
        else {
          var successHandler = function (position) {
            employeAdresse = {
              lng: position.coords.longitude,
              lat: position.coords.latitude
            };
          }

          var errorHandler = function (errorObj) {
            alert("vouliez activer la le GPS");
          };

          navigator.geolocation.getCurrentPosition(
            successHandler, errorHandler,
            { enableHighAccuracy: true, maximumAge: 10000 });
        }

        // jusqu'a on a recuper la position de l'employé si il a aucun commande et si il une commande plus tard pour calculer la date d'arrive

        // et là on recupere l'adresse de la commande
        $.post("getAdresseCommande", {
          idCommande: idCommande,
        },
          function (donnee, status) {

            if (donnee.statut == 'done') {
              gpsTraitement2(
                {
                  employe: employeAdresse,
                  adress: donnee.adress
                }, (resp) => {
                  // quand on accepete une commande on doit recalculer les que cet employe a 
                  // si on refuse on doit la recalculer pour l'envoyé un a autre employé
                  // quand l'employé l'accepete on doit envoyé la montré au client 

                  $.post("accepterUneNouvelleCommande", {
                    idCommande: idCommande,
                    dateArrive: dateTime
                  },
                    function (data, status) {
                      if (data.statut == 'done') {
                        location.reload();
                        alert("vous avez accepté une nouvelle commande  ");
                      }
                      else console.log("il y a un erreur");
                    });
                });
            }
            else console.log("il y a un erreur 2");
          });
      }
      else console.log("il y a un erreur3");
    });


}





function gpsTraitement2(inputs, Callback) {
  console.log(inputs)
  let client = inputs.adress;
  let employe = inputs.employe;
  let duree;
  let service = new google.maps.DistanceMatrixService();

  service.getDistanceMatrix(
    {
      origins: [client],
      destinations: [employe],
      travelMode: 'DRIVING',
    }, (response, statuts) => {
      duree = response.rows[0].elements[0].duration.value;
      Callback(duree);
    });

}


// ######################################
function commandeAnnule(idCommande) {
  Swal.fire({
    title: "Est vous sure de l'annuler ",
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off',
      placeholder: 'description'
    },
    showCancelButton: true,
    confirmButtonText: 'oui',
    showLoaderOnConfirm: true,
    preConfirm: (description) => {
      return description
    }
  }).then((result) => {
    if (result.value) {
      $.post("commandeAnnule",
        {
          idCommande: idCommande,
          description: result.value
        },
        function (data, status) {
          if (data == "done") {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'La commande est annulé',
              showConfirmButton: false,
              timer: 1500
            });
            location.reload();
          }
          else {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'il y a un erreur',
              showConfirmButton: false,
              timer: 1500
            });
            location.reload();
          }

        });
    }
  });


}



// ################################################  Refuser Une commande ################################################
let idCommandeLocal;

function refuserUneCommande(idCommande) {
  idCommandeLocal = idCommande;
  // quand il refuse une commmande 
  //  1- on doit supprimer la commande de la table commandeEnAttente
  //  2- on doit acctualiser la page
  $.post("refuserUneCommande", {
    idCommande: idCommande
  },
    function (data, status) {
      if (data == 'done') {
        // location.reload();
        alert("vous avez supprimé une nouvelle commande");
      }
      else alert("il y a un erreur");
    });
}



var dateNow = moment().tz("Africa/Casablanca").format("YYYY-MM-DD HH:mm:ss");

socket.on('sendLocation', function (data, from) {
  console.log(data)
  // data contient les employé connecté 
  // get adresse commande contient l'adress de la commande 
  $.get("getIdUtil", {},
    function (idEmp, status) {
      if (status == "success") {
        if (from == "employeRefuseUneCommande" + idEmp) {
          $.post("recupererLesEmployesQuiOntRefuseCetteCommande", {
            idCommande: idCommandeLocal
          },
            function (result, status) {
              if (result.statut == 'done') {
                console.log("data");
                console.log(data);
                console.log("data.length : " + data.length);
                console.log("result");
                console.log(result);
                for (var i = 0; i < data.length; i++) {
                  for (var j = 0; j < data.length; j++) {
                    if (data[i].idEmp) {
                      if (data[i].idEmp == result.employes[j].idEmp) {
                        console.log("##################")
                        data.splice(i, 1);
                        console.log("data in boucle");
                        console.log(data);
                      }
                    }
                  }
                }

                console.log("data after");
                console.log(data);
                if (data.length > 0) {

                  $.post("getAdresseCommande", {
                    idCommande: idCommandeLocal,
                  },
                    function (donnee, status) {
                      if (donnee.statut == 'done') {
                        console.log("get location socket Employé side from server 2 ");
                        gpsTraitement({ employe: data, idCommande: idCommandeLocal, adress: donnee.adress }, (resp) => {
                          resp.sort(compare);
                          console.log("reponses : ")
                          console.log(resp)
                          socket.emit('envoyerLesEmployeProche', resp);
                          // location.reload();
                        });
                      }
                      else {
                        alert("il y a un erreur");
                        location.reload();
                      }
                    });
                }

                else {
                  alert("il y a aucun autre employé connecté")
                }
              }
              else alert("il y a un erreur");
            });
        }

        if (from == "employeAccepteUneCommande" + idEmp) {
          $.post("recupererToutesLesCommandesEnAttentesDeCetEmploye",
            function (result, status) {
              if (result.statut == 'done') {
                console.log(result.commande)
                for (var i = 0; i < result.commande.length; i++) {
                  $.post("getAdresseCommande", {
                    idCommande: result.commande[i].idCommande
                  },
                    function (donnee, status) {
                      if (donnee.statut == 'done') {
                        console.log("get location socket Employé side from server 2 ");
                        gpsTraitement({ employe: data, idCommande: result.commande[i].idCommande, adress: donnee.adress }, (resp) => {
                          resp.sort(compare);
                          console.log("reponses : ")
                          console.log(resp)
                          socket.emit('envoyerLesEmployeProche', resp);
                        });
                      }
                      else {
                        alert("il y a un erreur");
                        location.reload();
                      }
                    });
                }
              }
              else alert("il y a un erreur");
            });
        }
      }
    });


  function compare(a, b) {
    if (a.dateArrive < b.dateArrive) {
      return -1;
    }
    if (a.dateArrive > b.dateArrive) {
      return 1;
    }
    return 0;
  }



  function gpsTraitement(inputs, Callback) {
    let client = inputs.adress;
    let locations = inputs.employe;
    let distances = [];
    let service = new google.maps.DistanceMatrixService();
    let employeAdresse;
    locations.forEach((e) => {
      if (e.dateFinRealisation && dateNow < moment(e.dateFinRealisation).format("YYYY-MM-DD HH:mm:ss")) {
        employeAdresse = e.adressPourSonDernierClient;
      }
      else {
        employeAdresse = { lat: e.latitude, lng: e.longitude };
      }
      service.getDistanceMatrix(
        {
          origins: [client],
          destinations: [employeAdresse],
          travelMode: 'DRIVING',
        }, (response, statuts) => {
          if (dateNow < moment(e.dateFinRealisation).format("YYYY-MM-DD HH:mm:ss")) {
            e.dateFinRealisation = moment(e.dateFinRealisation).add(response.rows[0].elements[0].duration.value, 'seconds').format("YYYY-MM-DD HH:mm:ss");
          }
          else {
            e.dateFinRealisation = dateNow;
            e.dateFinRealisation = moment(e.dateFinRealisation).add(response.rows[0].elements[0].duration.value, 'seconds').format("YYYY-MM-DD HH:mm:ss");
          }
          distances.push({
            idCommande: inputs.idCommande,
            idEmp: e.idEmp,
            dateArrive: e.dateFinRealisation,
            clientAdresse: response.originAddresses[0],
            employeAdresse: response.destinationAddresses[0],
            distanceEnKM: response.rows[0].elements[0].distance.text,
            duration: response.rows[0].elements[0].duration.text,
          });

          if ((locations.length) == distances.length) { Callback(distances); }
        });
    })
  }

});


/************************fonction de recuperation de tous les donnees de profile**********************/




// function moin() {
//   $("#details").hide(1000);
//   $("#moin").replaceWith('<button id="plus" onclick="plus()" style=" background: bottom; border: aliceblue;color: blue;">Détails</button>')
// }

// function plus() {
//   $("#details").show(1000);
//   $("#plus").replaceWith('<button id="moin" onclick="moin()" style=" background: bottom; border: aliceblue;color: blue;">Moin</button>')
// } 