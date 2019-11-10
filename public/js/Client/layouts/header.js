
var idClient;
$.get("getIdUtil",
    function (donnee, status) {
        idClient = donnee;
        console.log("idClient : " + idClient)
    });






var audio = new Audio('alarm.mp3');

var socket = io.connect('http://192.168.1.55:8083');
socket.on('sendConfiramtionToClient7', function (idCommande) {

    $.post("verifyIdCommande", {
        idCommande: idCommande,
    },
        function (donnee, status) {
            setInterval(function () {
                audio.play();
            }, 3000);

            if (donnee.statut == 'done') {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                })

                swalWithBootstrapButtons.fire({
                    title: 'vous acceptez cette commande ?',
                    text: "Notre employé arrive le : " + donnee.dateDebutRealisation,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'oui',
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: true,
                    allowOutsideClick: false,
                    timer: 20000

                }).then((result) => {
                    if (result.value) {
                        $.post("clientAccepteSaCommande", {
                            idCommande: idCommande,
                        },
                            function (donnee, status) {
                                // si la commande est effectué a cet employe
                                if (donnee == 'done') {
                                    swalWithBootstrapButtons.fire(
                                        'Accepté!',
                                        'votre commande est accepté',
                                        'success'
                                    )
                                    location.reload(true);
                                }
                            });
                    } else if (
                        /* Read more about handling dismissals below */
                        result.dismiss === Swal.DismissReason.cancel
                    ) {
                        $.post("commandeAnnule", {
                            idCommande: idCommande,
                        },
                            function (donnee, status) {
                                // si la commande est effectué a cet employe
                                if (donnee == 'done') {

                                    swalWithBootstrapButtons.fire(
                                        'Cancelled',
                                        'votre commande est annulé :)',
                                        'error'
                                    )
                                    location.reload(true);
                                }
                            });
                    }
                })
            }
        });


});