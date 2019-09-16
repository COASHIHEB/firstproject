/***** Search for contacte  *****/
$(document).ready(function(){
    $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $(".dropdown-menu li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });


  var fenetre = ['0','0'];

/***** variable globale pour conte le nobre des boites des message ouvert ******/
var nbrBoiteMessage;
function conteur(){
  if(nbrBoiteMessage == 0){
    //caché les boites du messages
    $("#boitMessage1").show(); //hide()
    nbrBoiteMessage+=1;
  }else if(nbrBoiteMessage == 1){
    //caché les boites du messages
    $("#boitMessage2").show();
    nbrBoiteMessage+=1;
  }else{
    nbrBoiteMessage=1;
  }
  return nbrBoiteMessage;
}


/*********     Methode pour fermer la boite du message      *********/
function fermer(val){
  fenetre[val-1]=0;
  if(nbrBoiteMessage==1){
    nbrBoiteMessage = 0;
  }else if(nbrBoiteMessage==2){
    if(val == 2){
      nbrBoiteMessage = 1;
    }
  }
  $("#boitMessage"+val).hide();
}

/**********   Methode pour ajouter un nouveau messages   ********/
function newMessage(id,nbrFenetre){
  if($('#myMessage'+nbrFenetre).val() != ""){
    //envoyer et ajouter le nouveau message sur la bdd
    $.post("message",{
      id: id,
      msg: $('#myMessage'+nbrFenetre).val(),
    },
    function(data, status){
      if(data == 'done'){
        $('#message'+id).append("<li style='color:midnightblue'><p style='background-color: white;border: 1px solid green; border-radius: 10px 25px 0px 12px;'> &nbsp;&nbsp;"+ $('#myMessage'+nbrFenetre).val() +"&nbsp;</p></li>");
        socket.emit('chat_message', $('#myMessage'+nbrFenetre).val());        
        $('#myMessage'+nbrFenetre).val("");
      }else{}
    });
  }
}


/********     methode pour afficher une boite des message     ********/
function messages(id){
  //recuperie les message d'un contacte
  $.post("messages",{id},
  function(data, status){
    if(data == 'error'){
    }else{
      if(fenetre[0] != id && fenetre[1] != id){
        $('#nomContacte'+conteur()).text(data.contactName);
        fenetre[nbrBoiteMessage-1]=id;
        $('#button'+nbrBoiteMessage).attr('onclick', 'newMessage('+id+','+nbrBoiteMessage+')');
        $('.message'+nbrBoiteMessage).attr('id', 'message'+id);
        $('.message'+nbrBoiteMessage).text("");
        data.messages.forEach(element => {
          if(id == element.idEmeteur){
            $('#message'+id).append("<li style='color:midnightblue'><p style='background-color: white;border: 1px solid green; border-radius: 10px 25px 0px 12px;'> &nbsp;&nbsp;"+element.texte+"&nbsp;</p></li>");
          }else{
            $('#message'+id).append("<li style='color:dimgray'><p style='background-color: white;border: 1px solid green; border-radius: 25px 10px 12px 0px;'> &nbsp;&nbsp;&nbsp;&nbsp;"+element.texte+"&nbsp;</p></li>");
          }
        });
      }
    }
  });
}
/****#eceff0
 * background-color: white;
    border: 1px solid green; 
    border-radius: 10px 25px 0px 12px;
 * ***/

/*****   debut Socket javascripte   *****/
var socket = io.connect('http://localhost:8083');


function contacts(){
  /***** inissialisé le variable globale pour conte le nobre des boites des message ouvert à 0 ******/
  nbrBoiteMessage = 0;
  // afficher les contactes
  $.post("contacts",
  function(data, status){
    if(data == 'error'){
    }else{
      data.contacts.forEach(element => {
        if(element.connected == "oui"){
          $('#contactsListe').append("<li><a class='list-group-item' href='#' onclick='messages("+element.idUtil+")'>"+element.nom+" "+element.prenom+" <i id='"+element.idUtil+"' style='color: green' class='menu-icon fas fa-circle float-right'></i></a></li>");
        }else{
          $('#contactsListe').append("<li><a class='list-group-item' href='#' onclick='messages("+element.idUtil+")'>"+element.nom+" "+element.prenom+" <i id='"+element.idUtil+"' style='color: red' class='menu-icon fas fa-circle float-right'></i></a></li>");
        }
      });

      // lancer socket
      socket.emit('username', data.userId);
    }
  });
}


// append the chat text message
socket.on('chat_message', function(msg,id){
  $('#message'+id).append("<li style='color:dimgray'><p style='background-color: white;border: 1px solid green; border-radius: 25px 10px 12px 0px;'> &nbsp;&nbsp;&nbsp;&nbsp;"+msg+"&nbsp;</p></li>")
});

// statut connected someone is online
socket.on('is_online', function(id) {
    $('#'+id).css("color","green");
});

// statut disconnected someone is online
socket.on('is_not_online', function(id) {
    $('#'+id).css("color","red");
});


/*****   fin Socket javascripte   *****/
