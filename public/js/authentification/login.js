
$(document).ready(function () {
    /**** vérifier le nom d'utiisateur****/
    $('#email').blur(function () {
        verefierEmail("email");
    });

    /**** vérifier le mot de passe ****/
    $('#password').blur(function () {
        verefirMdp();
    });

    /**** envoyer data du formulaire ****/
    $("#login").click(function () {
        $.post("login",
            {
                email: $("#email").val(),
                password: $("#password").val(),
            },
            function (data, status) {
                if (data == 'error') {
                    $('#emailValide').css("background-color", "red");
                    $('#passwordValide').css("background-color", "red");
                    $('#passwordWarning').css("color", "red");
                    $("#passwordWarning").text("Mot de passe ou email incorect");
                } else if (data == 'NonValide') {
                    $('#passwordWarning').css("color", "red");
                    $("#passwordWarning").text("Compte n'est pas encore validé");
                }
                else {
                    //$(document).ready( function() {
                    $(location).attr("href", "/dashboard-admin");
                    //});
                }
            });
    });
});


/**** envoyer un nouveau mot de passe ****/
function test() {
    $.post("password",
        {
            email: $("#email").val(),
        },
        function (data, status) {
            if (data == 'error') {
                $('#emailWarning').css("color", "red");
                $("#emailWarning").text("Envoyer à nouveau");
            } else if (data == 'NonValide') {
                $('#emailValide').css("background-color", "red");
                $('#emailWarning').css("color", "red");
                $("#emailWarning").text("Compte n'est pas encore validé");
            } else if (data == 'nonModifier') {
                $('#emailWarning').css("color", "red");
                $("#emailWarning").text("Envoyer à nouveau");
            } else {
                $('#emailValide').css("background-color", "green");
                $('#emailWarning').css("color", "green");
                $("#emailWarning").text("Vérifier votre adresse mail !");
                $('#mdpOblie').after("<a href='/login' class='text-black text-small'>Connecter</a>");
            }
        });
}


/**** le formulaire de recupiration d'un mot de passe ****/
function motDepasseOblie() {
    $('.remove').remove();
    $('.login').text("Mot de passe oublié");
    $('#login').after("<button name='password' onclick='test()' class='btn btn-primary submit-btn btn-block' id='mdpOblie'>Envoyer</button>");
    $('#login').remove();
}


/**** vérifier le mot de passe ****/
function verefirMdp() {
    if ($('#password').val() != "") {
        if ($('#password').val().length >= 6) {
            $('#passwordValide').css("background-color", "green");
        } else {
            $('#passwordValide').css("background-color", "red");
            $('#passwordWarning').css("color", "red");
            $("#passwordWarning").text("Le mot de passe est courte");
        }
    }
}

/**** vérifier l'email ****/
function verefierEmail(val) {
    var expressionReguliere = /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

    if ($('#' + val).val() != "") {
        if (expressionReguliere.test($('#' + val).val())) {
            $('#' + val + 'Valide').css("background-color", "green");
            $('#' + val + 'Warning').text("");
        } else {
            $('#' + val + 'Valide').css("background-color", "red");
            $('#' + val + 'Warning').css("color", "red");
            $('#' + val + 'Warning').text("Email incorrecte");
        }
    }
}
