// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

/*
venom
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    if (message.body === 'Hi' && message.isGroupMsg === false) {
      client
        .sendText(message.from, 'Welcome Venom 🕷')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }
  });
}
*/


const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;


app.use(express.static(__dirname));
app.get('/', (req, res) => {
  openWhatsAppBotClient();
  res.send("Cargando, por favor espere...");
})


app.get('/refresh', (req, res) => {
  fs.readFile(path.join(__dirname, "qr-window.html"), 'utf8', (error, datos) => {
    if (error) {
      datos = "Cargando, por favor espere..."
    }
    res.send(datos);
  });
})


app.listen(port, () => {
  console.log(`WhatsAppBot listening at http://localhost:${port}`)
})


function openWhatsAppBotClient(){
  venom
  .create(
    'sessionName',
    (base64Qr, asciiQR, attempts, urlCode) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      fs.writeFile(
        'qr-code-session.png',
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    undefined,
    { logQR: false }
  )
  .then((client) => {
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });
}


function start(client) {
  client.onMessage((message) => {
    var content = message.content.toUpperCase();
    if (content === 'HOLA' || content === 'OLA') {
      client
        .sendText(message.from, 'Hola! Por favor ingrese su RFC para compartirle su recibo de nómina, este debe ser de 13 caracteres:')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error1|
        });
    }
    else if(content.length != 13){
      client.sendText(message.from, "El RFC debe ser de 13 caracteres. Por favor vuelva a intentarlo. Ingrese su RFC para compartirle su recibo de nómina:")
      .then((result) => {
        console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });
    }
    else
    {
      client.sendText(message.from, "Estamos generando su recibo, un momento por favor...")
      .then((result) => {
        console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });

      client.sendFile(
        message.from,
        'http://www.colegiomarabierto.cl/doc/cuento%20El-monstruo-de-colores.pdf',
        message.content,
        'Aquí tiene su recibo, si los datos son incorrectos por favor repórtelo. Que tenga un excelente día!'
      )
      .then((result) => {
        console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });
    }
  });
}