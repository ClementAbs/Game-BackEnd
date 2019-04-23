/**
  Le Serveur HTTP.
  URL : http://[adresse IP/nom de domaine]:8888/

  Ce serveur produit une réponse HTTP contenant un document
  HTML suite à une requête HTTP provenant d'un client HTTP.
**/

// Chargement du module HTTP.
const http = require('http');

const port = process.env.PORT;

// Création du serveur HTTP.
var httpServer = http.createServer();

// Fonction qui produit la réponse HTTP.
var writeResponse = function writeHTTPResponse(HTTPResponse, responseCode, responseBody) {
    HTTPResponse.writeHead(responseCode, {
        'Content-type': 'text/html; charset=UTF-8',
        'Content-length': responseBody.length
    });
    HTTPResponse.write(responseBody, function() {
        HTTPResponse.end();
    });
};

// Fonction qui produit une réponse HTTP contenant un message d'erreur 404 si le document HTML n'est pas trouvé.
var send404NotFound = function(HTTPResponse) {
    writeResponse(HTTPResponse, 404, '<doctype html!><html><head>Page Not Found</head><body><h1>404: Page Not Found</h1><p>The requested URL could not be found</p></body></html>');
}; 

/**
  Gestion de l'évènement 'request' : correspond à la gestion
  de la requête HTTP initiale permettant d'obtenir le fichier
  HTML contenant le code JavaScript utilisant l'API WebSocket.
**/
httpServer.on('request', function(HTTPRequest, HTTPResponse) {
    //console.log('Événement HTTP \'request\'.');
    var fs = require('fs');
    // Le fichier HTML que nous utiliserons dans tous les cas.
    var filename = 'websocket-client.html';
    fs.access(filename, fs.R_OK, function(error) {
        if (error) {
            send404NotFound(HTTPResponse);
        } else {
            fs.readFile(filename, function(error, fileData) {
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

// INITIALISATION DE LA BASE DE DONNEES
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const MONGODB_URI = process.env.MONGODB_URI; 
const Userscoll = 'Userscoll'
const dbName = 'users';
const chalk = require('chalk');
let scoreJoueurs = [];
const Scores='Scores';

let usersRenvoi = [];


socketIOWebSocketServer.on('connection', function(socket) {


mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function(erreur, client) {
    if (erreur) {
      console.log(chalk.red(`Impossible de se connecter à MongoDB`));
    } else {
      let db = client.db(dbName);
      db.collection(Userscoll, {strict: true}, function(erreur, collection) {
        if (erreur) {
          console.log(chalk.red(`Impossible de se connecter à la collection ` + Userscoll));
          
        } else {
          let cursor = collection.find();
          cursor.toArray(function(erreur, documents) {
            if (erreur) {
              console.log(chalk.red(`Impossible de parcourir la collection ` + Userscoll));
            } else {
              for (let i = 0; i < documents.length; i++) {
                usersRenvoi.push(documents[i]);
              
              }
              socketIOWebSocketServer.emit('envoiFront', usersRenvoi);
            }
            client.close();
          });
        }
      });
    }
  });


mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function(erreur, client) {
    if (erreur) {
      console.log(chalk.red(`Impossible de se connecter à MongoDB`));
    } else {
      let db = client.db(dbName);
      db.collection(Scores, {strict: true}, function(erreur, collection) {
        if (erreur) {
          console.log(chalk.red(`Impossible de se connecter à la collection ` + score));
          client.close();
        } else {
          let cursor = collection.find();
          cursor.toArray(function(erreur, documents) {
            if (erreur) {
              console.log(chalk.red(`Impossible de parcourir la collection ` + score));
            } else {
              for (let i = 0; i < documents.length; i++) {
                scoreJoueurs.push(documents[i]);
              }
              socketIOWebSocketServer.emit('listeScores', scoreJoueurs);
             
            }
            client.close();
          });
        }
      });
    }
  });
  
  
  socket.on('choucroute', function(evt) {
    mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function(erreur, client) {
        
      if (erreur) {
        console.log(chalk.red(`Impossible de se connecter à MongoDB`));
      } else {
        let db = client.db(dbName);
      
        db.collection(Scores).insertOne({
          scoreJoueurs: evt.score,
          name: evt.name,
          date: new Date()
        }, function(erreur, reponse) {
          if (erreur) {
            console.log(chalk.red(`Impossible d'enregistrer le score dans la base de données`));
          }
        });

   
        db.collection(Scores, {strict: true}, function(erreur, collection) {
          if (erreur) {
            console.log(chalk.red(`Impossible de se connecter à la collection ` + collectionScores));
            client.close();
          } else {
            let cursorFind = collection.find();
            cursorFind.toArray(function(erreur, documents) {
              if (erreur) {
                console.log(chalk.red(`Impossible de parcourir la collection ` + collectionScores));
              } else {
                scoreJoueurs.push(documents[documents.length - 1]);
                socketIOWebSocketServer.emit('listeScores', scoreJoueurs);
              }
              client.close();
            });
          }
        });
      }
    });
  });



/**
 * Gestion de l'évènement 'connection' : correspond à la gestion
 * d'une requête WebSocket provenant d'un client WebSocket.
 */

var objetVide = {};






    function randomFunction(min, max) {
        return Math.floor((max - min) * Math.random()) + min
    };

    var randomNumber = randomFunction(1, 10000);

    var objetBis = {
        topHaut: "0px",
        topBas: "0px",
        id: randomNumber,
        backgroundColor: '#' + Math.floor(Math.random() * 500).toString(16)
    };




    socket.on('jeDeclencheMonEventBack', function(Myarg) {



        socketIOWebSocketServer.emit('envoiId', objetBis.id);


    })




    objetVide[objetBis.id] = objetBis;

    socket.emit('creationCarre', objetBis);



    // socket : Est un objet qui représente la connexion WebSocket établie entre le client WebSocket et le serveur WebSocket.

    /**
     * On attache un gestionnaire d'évènement à un évènement personnalisé 'unEvenement'
     * qui correspond à un événement déclaré coté client qui est déclenché lorsqu'un message
     * a été reçu en provenance du client WebSocket.
     */
    socket.on('unEvenement', function(message) {

        // Affichage du message reçu dans la console.
        console.log(message);

        // Envoi d'un message au client WebSocket.
        socket.emit('unAutreEvenement', {
            texte: 'Message bien reçu !'
        });

        /**
          On déclare un évènement personnalisé 'unAutreEvenement'
          dont la réception sera gérée coté client.
        **/
    });


    socket.on('envoiBack2', function(monNom){

      console.log(monNom);
      socket.emit('resultat2', monNom)

    });


    socket.on('envoiInsc', function(evenementReceive){

        console.log(evenementReceive);  
    });

    socket.on('envoiInsc2', function(evenementReceive2){

        console.log(evenementReceive2);  
    });


    socket.on('envoiBack', function(evt) {

        console.log(evt);

        valeurId = objetBis.id;

        var score = 0;

        // console.log(valeurId); //  Valeur aléatoire générée automatiquement

        console.log("Yo ta valeur c'est " + valeurId);
        valeurId = parseInt(valeurId, 10);

        if (valeurId == evt)

        {
            console.log("Yo ta valeur c'est " + valeurId);

            score++;
            socket.emit('resultat', {
                clement: "egal",
                score
            });


        }
        if (valeurId < evt) {
            console.log("Yo ta valeur c'est " + valeurId);


            socket.emit('resultat', {
                clement: "moin",
                score
            });

        }
        if (valeurId > evt) {
            console.log("Yo ta valeur c'est " + valeurId);


            socket.emit('resultat', {
                clement: "sup",
                score
            });
        }




    });




    socket.on('event', function(movecarre) {
        objetBis.topHaut = movecarre.yHaut;
        objetBis.topBas = movecarre.yBas;
        // console.log("Haut NEW", movecarre.yHaut);
        // console.log("Bas NEW", movecarre.yBas);

        socketIOWebSocketServer.emit('creationCarre', objetBis)
    });

    socket.on('disconnect', function() {

        delete objetVide[objetBis.id];
        socketIOWebSocketServer.emit('deleteDiv', objetBis);
    })


});




httpServer.listen(port, function() {
    console.log(port);
});