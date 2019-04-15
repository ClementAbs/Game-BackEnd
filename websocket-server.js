/**
  Le Serveur HTTP.
  URL : http://[adresse IP/nom de domaine]:8888/

  Ce serveur produit une réponse HTTP contenant un document
  HTML suite à une requête HTTP provenant d'un client HTTP.
**/

// Chargement du module HTTP.
const http = require('http');

// Création du serveur HTTP.
var httpServer = http.createServer();

// Fonction qui produit la réponse HTTP.
var writeResponse = function writeHTTPResponse(HTTPResponse, responseCode, responseBody) {
  HTTPResponse.writeHead(responseCode, {
    'Content-type': 'text/html; charset=UTF-8',
    'Content-length': responseBody.length
  });
  HTTPResponse.write(responseBody, function () {
    HTTPResponse.end();
  });
};

// Fonction qui produit une réponse HTTP contenant un message d'erreur 404 si le document HTML n'est pas trouvé.
var send404NotFound = function (HTTPResponse) {
  writeResponse(HTTPResponse, 404, '<doctype html!><html><head>Page Not Found</head><body><h1>404: Page Not Found</h1><p>The requested URL could not be found</p></body></html>');
};

/**
  Gestion de l'évènement 'request' : correspond à la gestion
  de la requête HTTP initiale permettant d'obtenir le fichier
  HTML contenant le code JavaScript utilisant l'API WebSocket.
**/
httpServer.on('request', function (HTTPRequest, HTTPResponse) {
  console.log('Événement HTTP \'request\'.');
  var fs = require('fs');
  // Le fichier HTML que nous utiliserons dans tous les cas.
  var filename = 'websocket-client.html';
  fs.access(filename, fs.R_OK, function (error) {
    if (error) {
      send404NotFound(HTTPResponse);
    } else {
      fs.readFile(filename, function (error, fileData) {
        if (error) {
          send404NotFound(HTTPResponse);
        } else {
          writeResponse(HTTPResponse, 200, fileData);
        }
      });
    }
  });
});

/**
 * Le Serveur WebSocket associé au serveur HTTP.
 * URL : ws://[adresse IP/nom de domaine]:8888/
 *
 * Ce serveur accepte une requête HTTP avec un en-tête upgrade et établit
 * une connexion persistante basée sur WebSocket.
 */

/**
 * On installe et on utilise le package socket.io.
 * La documentation est ici :
 * - https://www.npmjs.com/package/socket.io
 * - https://github.com/socketio/socket.io
 * - http://socket.io/
 */
var socketIO = require('socket.io');

//  On utilise utilise la fonction obtenue avec notre serveur HTTP.
var socketIOWebSocketServer = socketIO(httpServer);

/**
 * Gestion de l'évènement 'connection' : correspond à la gestion
 * d'une requête WebSocket provenant d'un client WebSocket.
 */

var objetVide = {};






socketIOWebSocketServer.on('connection', function (socket) {


  function randomFunction (min,max){
     return Math.floor((max - min) * Math.random())+min
  };

  var randomNumber = randomFunction(1,10000);

var objetBis ={ 
  topHaut:"0px",
  topBas:"0px",
  id : randomNumber,
  backgroundColor : '#'+Math.floor(Math.random()*16777215).toString(16)
};





 if(randomNumber){

   console.log(objetBis);
 }



objetVide[objetBis.id]= objetBis;

socket.emit('creationCarre',objetBis);



  // socket : Est un objet qui représente la connexion WebSocket établie entre le client WebSocket et le serveur WebSocket.

  /**
   * On attache un gestionnaire d'évènement à un évènement personnalisé 'unEvenement'
   * qui correspond à un événement déclaré coté client qui est déclenché lorsqu'un message
   * a été reçu en provenance du client WebSocket.
   */
  socket.on('unEvenement', function (message) {

    // Affichage du message reçu dans la console.
    console.log(message);

    // Envoi d'un message au client WebSocket.
    socket.emit('unAutreEvenement', { texte: 'Message bien reçu !' });

    /**
      On déclare un évènement personnalisé 'unAutreEvenement'
      dont la réception sera gérée coté client.
    **/
  });


  socket.on('envoiBack', function (evt) {

    var maVariableBack = evt;
    console.log(maVariableBack);
  
  });


  socket.on('event', function(movecarre){
      objetBis.topHaut=movecarre.yHaut;
      objetBis.topBas=movecarre.yBas;
      // console.log("Haut NEW", movecarre.yHaut);
      // console.log("Bas NEW", movecarre.yBas);

      socketIOWebSocketServer.emit('creationCarre', objetBis)
  });

  socket.on('disconnect', function () {

    delete objetVide[objetBis.id];
    socketIOWebSocketServer.emit('deleteDiv', objetBis);
  })
  

});





httpServer.listen(8888, function(){
  console.log("8888!");
});
