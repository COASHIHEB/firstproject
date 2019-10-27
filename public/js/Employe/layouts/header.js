
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
    alert("il y a un probleme avec l'autorisation de position dans votre portable");
  };

  navigator.geolocation.getCurrentPosition(
    successHandler, errorHandler,
    { enableHighAccuracy: true, maximumAge: 10000 });
});


socket.on('notifieEmployeNouvelleCommandeEstInserer', function (data) {
  // on recupere l'id employé et on verifie si il est le meme id pour la commande qui existe dans le data
  $.post("verifyIdEmploye", {
    idCommande: data[0].idCommande,
  },
    function (donnee, status) {
      // si la commande est effectué a cet employe
      if (donnee == 'done') {
        getCommandeEnAttente();
      }
    });


  // recuperer les commande en attente pour cet employe
  function getCommandeEnAttente() {
    $.get("getCommandeEnAttente",
      function (data, status) {
        if (1) {
          // data = list des commandes en attentes -> on doit l'impletement a la route et au modele
          // on met les valeurs à Div 
          // on click accepter commande on doit ajouter l'idCOmmande
        }
      });
  }
});

function accepterUneNouvelleCommande(idCommande) {
  // quand on accepete une commande on doit recalculer les que cet employe a 
  // si on refuse on doit la recalculer pour l'envoyé un a autre employé
  // quand l'employé l'accepete on doit envoyé la montré au client 
  // et on doit mettre appeler la fonction getCommandeEnAttente 

  $.post("accepterUneNouvelleCommande", {
    idCommande: idCommande
  },
    function (data, status) {
      if (data == 'done') {
        // getCommandeEnAttente();
        alert("vous avez accepté une nouvelle commande , ");
      }
      else alert("il y a un erreur");
    });

}

let idCommandeLocal;

function refuserUneCommande(idCommande) {
  idCommandeLocal = idCommande;
  // quand il refuse une commmande 
  //  1- il doit envoyer un requetes aux employé pours qu'ils se localisent 
  //  2- 

  $.post("refuserUneCommande", {
    idCommande: idCommande
  },
    function (data, status) {
      if (data == 'done') {
        // getCommandeEnAttente();
        alert("vous avez supprimé une nouvelle commande");
      }
      else alert("il y a un erreur");
    });
}





socket.on('sendLocation', function (data, from) {
  if (from = "employe") {
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
          });
        }
        else alert("il y a un erreur");
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
      var dateNow = moment().tz("Africa/Casablanca").format("YYYY-MM-DD HH:mm:ss");
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
            if (moment().tz("Africa/Casablanca").format("YYYY-MM-DD HH:mm:ss") < moment(e.dateFinRealisation).format("YYYY-MM-DD HH:mm:ss")) {
              e.dateFinRealisation = moment(e.dateFinRealisation).add(response.rows[0].elements[0].duration.value, 'seconds').format("YYYY-MM-DD HH:mm:ss");
            }
            else {
              e.dateFinRealisation = moment().tz("Africa/Casablanca").format("YYYY-MM-DD HH:mm:ss");
              e.dateFinRealisation = moment(e.dateFinRealisation).add(response.rows[0].elements[0].duration.value, 'seconds').format("YYYY-MM-DD HH:mm:ss");
            }
            distances.push({
              idCommande: idCommande,
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


  }

});
/************************fonction de recuperation de tous les donnees de profile**********************/




function moin() {
  $("#details").hide(1000);
  $("#moin").replaceWith('<button id="plus" onclick="plus()" style=" background: bottom; border: aliceblue;color: blue;">Détails</button>')
}

function plus() {
  $("#details").show(1000);
  $("#plus").replaceWith('<button id="moin" onclick="moin()" style=" background: bottom; border: aliceblue;color: blue;">Moin</button>')
} 