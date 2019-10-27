var idCommande, adress, numero;
$(document).ready(function () {
    /************************audio pour choisit si l'Adress de comte ou l'autre **********************/
    $("#one").on("click", function () {
        $('#adress').attr('type', 'hidden');
    });

    $("#two").on("click", function () {
        $('#adress').attr('type', 'text');
    });

    /************************audio pour choisit si le numero du téléphone  de comte ou l'autre **********************/
    $("#onee").on("click", function () {
        $('#numero').attr('type', 'hidden');
    });

    $("#twoe").on("click", function () {
        $('#numero').attr('type', 'text');
    });

    /*****   debut Socket javascripte   *****/
    /************************button pour lancer la commande **********************/
    $(".submit-order-btn").on("click", function () {
        if ($(".submit-order-btn").attr('id') > 0) {
            $.post("lancerCommande", {
                idCommande: $(".submit-order-btn").attr('id') / 10,
                adress: $('#adress').attr('type') != 'hidden' ? $('#adress').val() : 'vide',
                numero: $('#numero').attr('type') != 'hidden' ? $('#adress').val() : 'vide',
            },
                function (data, status) {
                    if (data.done == 'done') {
                        idCommande = data.idCommande;
                        adress = data.adress;
                        numero = data.numero;
                    } else {
                        swal("OPS, La commande n'a pas passé !", {
                            icon: "error",
                        });
                    }
                });
        } else {
            swal("Vous etes aucune commande à lancer !", {
                icon: "error",
            });
        }
    });

});




function initMap() {
    testMap = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 34.8274, lng: -1.5283 },
        zoom: 10
    });
}

var socket = io.connect('http://192.168.1.55:8083');
var d;

socket.on('sendLocation', function (data, from) {
    if (from == "client") {
        console.log("get location socket client side from server 2 ");
        gpsTraitement({ employe: data, idCommande: idCommande, adress: adress }, (resp) => {
            resp.sort(compare);
            console.log("reponses : ")
            console.log(resp)
            socket.emit('envoyerLesEmployeProche', resp);
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


