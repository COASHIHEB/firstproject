
socket.on('sendConfiramtionToClient', function (idCommande) {

    $.post("verifyIdClient", {
        idCommande: idCommande,
    },
        function (donnee, status) {
            // si la commande est effectué a cet employe
            if (donnee == 'done') {
                setTimeout(function () {
                    window.location.reload();
                }, 2000)
            }
        });

});