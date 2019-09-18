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


/*********    Methode pour fait vu pour tous les messages non lu    ********/
function viewAll(){
  $.post("viewAll",
  function(data, status){
    if(data.msg == 'done'){
      $('#messageDropdown'+data.userId+' span').remove();
      $('#notificationListe'+data.userId).empty();
      $('#msgNbr'+data.userId).empty();
      $('#msgNbr'+data.userId).append("Tu as <b>0</b> messages non lu");
    }
  });
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
            $('#message'+id).append("<li style='color:dimgray'><p style='background-color: white;border: 1px solid green; border-radius: 10px 25px 0px 12px;'> &nbsp;&nbsp;"+element.message+"&nbsp;</p></li>");
          }else{
            $('#message'+id).append("<li style='color:midnightblue'><p style='background-color: white;border: 1px solid green; border-radius: 25px 10px 12px 0px;'> &nbsp;&nbsp;&nbsp;&nbsp;"+element.message+"&nbsp;</p></li>");
          }
        });
        
      }
      
      // afficher le nombres des notifications sur le header
        $('#messageDropdown'+data.userId+' span').remove();
      if(data.notifications.length > 0){
        $('#messageDropdown').attr('id','messageDropdown'+data.userId);
        $('#messageDropdown'+data.userId+' i').after("<span class='count'>"+data.notifications.length+"</span>");
      }

      
      $('#msgNbr'+data.userId).empty();
      $('#msgNbr').attr('id','msgNbr'+data.userId);
      $('#msgNbr'+data.userId).append("Tu as <b>"+data.notifications.length+"</b> messages non lu");

      $('#notificationListe'+data.userId).empty();
      $('#notificationListe').attr('id','notificationListe'+data.userId);

      // afficher les notifications (les message non lu)
      data.notifications.forEach(element => {
        var date = new Date().getTime();
        var d = date - new Date(element.date).getTime();
        d *=0.001;
        if( d < 60){
          d = Math.trunc(d) + " s"; // le message recoit ne dépasse pas 59 s
        }else{
          d /= 60;
          if(d < 60){
            d = Math.trunc(d) + " mn";// le message recoit ne dépasse pas 59 mn
          }else{
            d /= 60;
            if(d < 24){
              d = Math.trunc(d) + " h";// le message recoit ne dépasse pas 24 h
            }else{
              d /= 24;
              if(d < 7){
                d = Math.trunc(d) + " jours"; // le message recoit ne dépasse pas 6 jours
              }else{
                d /= 7;
                if(d < 4){
                  d = Math.trunc(d) + " semaine"; // le message recoit ne dépasse pas 3 semaine
                }else{
                  d /= 4;
                  if(d < 12){
                    d = Math.trunc(d) + " mois"; // le message recoit ne dépasse pas 12 mois
                  }else{
                    d /= 12;
                    d = Math.trunc(d) + " années"; 
                  }
                }
              }
            }
          }
        }

        $('#notificationListe'+data.userId).append("<div class='dropdown-divider'></div><a id='"+element.idUtil+"' onclick='messages("+element.idUtil+")' class='dropdown-item preview-item'><div class='preview-thumbnail'><img src='images/profilePicture/"+element.image+"' alt='image' class='profile-pic'></div><div class='preview-item-content flex-grow'><h6 class='preview-subject ellipsis font-weight-medium text-dark'>"+element.nom+" "+element.prenom+"<span class='float-right font-weight-light small-text'><b>"+d+" </b></span></h6><p class='font-weight-light small-text'>"+(element.message).substr(0, 20)+" <span style='background-color:red; border-color :red' class='badge badge-info badge-pill float-right'>"+element.nbr+"</span></p></div></a>");
      });
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
          $('#contactsListe').append("<li><a class='list-group-item' href='#' onclick='messages("+element.idUtil+")'><img src='images/profilePicture/"+element.image+"' alt='image' style='vertical-align: middle; width: 50px; height: 50px; border-radius: 50%;'> &nbsp;&nbsp;"+element.nom+" "+element.prenom+" <i id='"+element.idUtil+"' style='color: green' class='menu-icon fas fa-circle float-right'></i></a></li>");
        }else{
          $('#contactsListe').append("<li><a class='list-group-item' href='#' onclick='messages("+element.idUtil+")'><img src='images/profilePicture/"+element.image+"' alt='image' style='vertical-align: middle; width: 50px; height: 50px; border-radius: 50%;'> &nbsp;&nbsp;"+element.nom+" "+element.prenom+" <i id='"+element.idUtil+"' style='color: red' class='menu-icon fas fa-circle float-right'></i></a></li>");
        }
      });
            // afficher le nombres des notifications sur le header
      if(data.notifications.length > 0){
        $('#messageDropdown').attr('id','messageDropdown'+data.userId);
        $('#messageDropdown'+data.userId+' i').after("<span class='count'>"+data.notifications.length+"</span>");
      }

      $('#msgNbr').attr('id','msgNbr'+data.userId);
      $('#msgNbr'+data.userId).append("Tu as <b>"+data.notifications.length+"</b> messages non lu");

      $('#notificationListe').attr('id','notificationListe'+data.userId);

      // afficher les notifications (les message non lu)
      data.notifications.forEach(element => {
        var date = new Date().getTime();
        var d = date - new Date(element.date).getTime();
        d *=0.001;
        if( d < 60){
          d = Math.trunc(d) + " s"; // le message recoit ne dépasse pas 59 s
        }else{
          d /= 60;
          if(d < 60){
            d = Math.trunc(d) + " mn";// le message recoit ne dépasse pas 59 mn
          }else{
            d /= 60;
            if(d < 24){
              d = Math.trunc(d) + " h";// le message recoit ne dépasse pas 24 h
            }else{
              d /= 24;
              if(d < 7){
                d = Math.trunc(d) + " jours"; // le message recoit ne dépasse pas 6 jours
              }else{
                d /= 7;
                if(d < 4){
                  d = Math.trunc(d) + " semaine"; // le message recoit ne dépasse pas 3 semaine
                }else{
                  d /= 4;
                  if(d < 12){
                    d = Math.trunc(d) + " mois"; // le message recoit ne dépasse pas 12 mois
                  }else{
                    d /= 12;
                    d = Math.trunc(d) + " années"; 
                  }
                }
              }
            }
          }
        }

        $('#notificationListe'+data.userId).append("<div class='dropdown-divider'></div><a id='"+element.idUtil+"' onclick='messages("+element.idUtil+")' class='dropdown-item preview-item'><div class='preview-thumbnail'><img src='images/profilePicture/"+element.image+"' alt='image' class='profile-pic'></div><div class='preview-item-content flex-grow'><h6 class='preview-subject ellipsis font-weight-medium text-dark'>"+element.nom+" "+element.prenom+"<span class='float-right font-weight-light small-text'><b>"+d+" </b></span></h6><p class='font-weight-light small-text'>"+(element.message).substr(0, 20)+" <span style='background-color:red; border-color :red' class='badge badge-info badge-pill float-right'>"+element.nbr+"</span></p></div></a>");
      });


      // lancer socket
      socket.emit('username', data.userId);
    }
  });
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
      if(data != 'error'){
       $('#message'+id).append("<li style='color:midnightblue'><p style='background-color: white;border: 1px solid green; border-radius: 10px 25px 0px 12px;'> &nbsp;&nbsp;"+ $('#myMessage'+nbrFenetre).val() +"&nbsp;</p></li>");
        socket.emit('notification', $('#myMessage'+nbrFenetre).val() , id , data);        
        $('#myMessage'+nbrFenetre).val("");
      }else{}
    });
  }
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

// statut notification
socket.on('notification', function(msg,idRcp,user) {

  //si l'utilisateur avoire aucun des notification
  if($('#messageDropdown'+idRcp+' span').text() == ''){

    $('#messageDropdown').attr('id','messageDropdown'+idRcp);
    $('#messageDropdown'+idRcp+' i').after("<span class='count'>1</span>");
    $('#msgNbr'+idRcp).empty();
    $('#msgNbr'+idRcp).append("Tu as <b>1</b> messages non lu");

    $('#notificationListe'+idRcp).append("<div class='dropdown-divider'></div><a id='"+user.idUtil+"' onclick='messages("+user.idUtil+")' class='dropdown-item preview-item'><div class='preview-thumbnail'><img src='images/profilePicture/"+user.image+"' alt='image' class='profile-pic'></div><div class='preview-item-content flex-grow'><h6 class='preview-subject ellipsis font-weight-medium text-dark'>"+user.nom+" "+user.prenom+"<span class='float-right font-weight-light small-text'><b> 1mn </b></span></h6><p class='font-weight-light small-text'>"+(msg).substr(0, 20)+" <span style='background-color:red; border-color :red' class='badge badge-info badge-pill float-right'>1</span></p></div></a>");

  }else{
    //si l'utilisateur avoire deja des notification
    if($('#'+user.idUtil+' span.badge').text() ==''){
      //si l'utilisateur avoire aucun des notification pour cet emeteur
      $('#messageDropdown'+idRcp+'span').after("<span class='count'>"+(parseInt($('#messageDropdown'+idRcp+' span').text())+1)+"</span>");
      $('#msgNbr'+idRcp).empty();
      $('#msgNbr'+idRcp).append("Tu as <b>"+(parseInt($('#messageDropdown'+idRcp+' span').text())+1)+"</b> messages non lu");

      $('#notificationListe'+idRcp).append("<div class='dropdown-divider'></div><a id='"+user.idUtil+"' onclick='messages("+user.idUtil+")' class='dropdown-item preview-item'><div class='preview-thumbnail'><img src='images/profilePicture/"+user.image+"' alt='image' class='profile-pic'></div><div class='preview-item-content flex-grow'><h6 class='preview-subject ellipsis font-weight-medium text-dark'>"+user.nom+" "+user.prenom+"<span class='float-right font-weight-light small-text'><b> 1mn </b></span></h6><p class='font-weight-light small-text'>"+(msg).substr(0, 20)+" <span style='background-color:red; border-color :red' class='badge badge-info badge-pill float-right'>1</span></p></div></a>");
    
    }else{
      //si l'utilisateur avoire deja des notification pour le meme emeteur
      var nbr = parseInt($('#'+user.idUtil+' span.badge').text());
      $('#'+user.idUtil+' p').html((msg).substr(0, 20)+"<span style='background-color:red; border-color :red' class='badge badge-info badge-pill float-right'>"+(nbr+1)+"</span>");
    }

  }

});


/*****   fin Socket javascripte   *****/
