/**** vérifier le nom ****/
$(document).ready(function() {
    $('#nom').blur(function(){
        name("nom");
    });
});

/**** vérifier le prenom ****/
$(document).ready(function() {
    $('#prenom').blur(function(){
        name("prenom");
    });
});

/**** vérifier le mot de passe ****/ 
$(document).ready(function() {
    $('#password').blur(function(){        
        password("password");
    });
});

/**** vérifier le mot de passe de confiramtion****/ 
$(document).ready(function() {
    $('#passwordConf').blur(function(){        
        password("passwordConf");
    });
});

/**** vérifier le telephone****/ 
$(document).ready(function() {
    $('#telf').blur(function(){        
        telephonne("telf");
    });
});

/**** vérifier l'email ****/ 
$(document).ready(function() {
    $('#email').blur(function(){        
        email("email");
    });
});

/**** envoyer data du formulaire ****/
$(document).ready(function() {
    $("#register").click(function(){
        if($("#nom").val() == ""){
            swal("Veuillez inserez votre nom.", {
                icon: "error",
              });
              return false;
        }
        $.post("register",
            {
              nom: $("#nom").val(),
              prenom: $("#prenom").val(),
              email: $("#email").val(),
              tel: $("#telf").val(),
              adresse: $("#adresse").val(),
              password: $("#password").val(),
            },
            function(data, status){
              if(data == 'error'){
                $('#passwordConfWarning').css("color","red");
                $('#passwordConfWarning').text("Informations invalide veuillez s’inscrire de nouveau");
              }else if(data == 'exist'){
                $('#emailValide').css("background-color","red");
                $('#emailWarning').css("color","red");
                $("#emailWarning").text("Email existe déja !");
              }else if(data == 'notInsert'){
                $('#passwordConfWarning').css("color","red");
                $('#passwordConfWarning').text("Informations invalide veuillez s’inscrire de nouveau");
              }else{
                $('#insVal').text('Vous etes inscrit');
                $('#remove').after("<div id='valider'></div>");
                $('#valider').prepend($('#login'));
                $('#login').before("<p> <div class='alert alert-success' role='alert'>Veuillez verifier votre email pour afin de pourvoir valider votre compte!</div> </p>");
                $('#remove').remove();
              }
            });
  });
});


/**** vérifier la syntaxe du mot de passe et mot de passe de confirmation ****/ 
function password(val) {     
    if($('#'+val).val() !== ""){
        if($('#'+val).val().length >= 6){
            $('#'+val+'Valide').css("background-color","green");
            $('#'+val+'Warning').text("");
        }else{
            $('#'+val+'Valide').css("background-color","red");
            $('#'+val+'Warning').css("color","red");
            $('#'+val+'Warning').text("Le mot de passe est court, Minimum 6 caractères");
        }
    }
}

/**** vérifier la syntaxe du mot de passe et mot de passe de confirmation ****/ 
function telephonne(val) {     
    if($('#'+val).val() !== ""){
        if($('#'+val).val().length == 10){
            $('#'+val+'Valide').css("background-color","green");
            $('#'+val+'Warning').text("");
        }else{
            $('#'+val+'Valide').css("background-color","red");
            $('#'+val+'Warning').css("color","red");
            $('#'+val+'Warning').text("Le numéro téléphone doit contenir 10 chiffres");
        }
    }
}

/**** vérifier la syntaxe du mot de passe et mot de passe de confirmation ****/ 
function email(val) {     
    var expressionReguliere = /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
        
    if($('#'+val).val() === ""){}
    else{
        if(expressionReguliere.test($('#'+val+'').val())){
            $('#'+val+'Valide').css("background-color","green");
            $('#'+val+'Warning').text("");
        }else{
            $('#'+val+'Valide').css("background-color","red");
            $('#'+val+'Warning').css("color","red");
            $('#'+val+'Warning').text("Email invalid");
        }
    }
}

/**** vérifier la syntaxe du nom et le prenom****/
function name(val){
    if($('#'+val).val() === ""){}
    else if($('#'+val).val().charCodeAt(0) < 65 || $('#'+val).val().charCodeAt(0) > 123){
        $('#'+val+'Valide').css("background-color","red");
        $('#'+val+'Warning').css("color","red");
        $('#'+val+'Warning').text("Le "+val+" doit commencer par une lettre");
    }else{
        $('#'+val+'Valide').css("background-color","green");
        $('#'+val+'Warning').text("");
    }
}

/**** vérifier si le mot de passe et mot de passe de confirmation sont identique ****/
function identique(){
    password("password");
    if($('#password').val() === $('#passwordConf').val()){
        password("passwordConf");
    }else{
        $('#passwordConfValide').css("background-color","red");
        $('#passwordConfWarning').css("color","red");
        $('#passwordConfWarning').text("Les mot de passe ne sont pas identiques !");
    }
}


