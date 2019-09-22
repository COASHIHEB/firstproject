module.exports = function (request, response, next){

    request.flash = function (type, content){
        if(request.session.flash === undefined){
            request.session.flash = {};
        }
        request.session.flash[type] = content;
        /* <---------- Important on peut envoyé sujet avec un appelle c'est totalement abstracte
        var messageArea = 'mesasgeE';
        var messageInput = 'mesasgeI';

        request.session.flash[messageArea] = request.body.messageName;
        request.session.flash[messageInput] = request.body.ImputTest;
        */
    }

    if (request.session.flash){ //cette partie elle sera exécuter lors de la réception de app.get('/')
        response.locals.flash = request.session.flash;
        request.session.flash = undefined;
    }
    
    next();
}