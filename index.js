// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
let qrWindow;


/*
if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, "node_modules", ".bin", "electron")
    });
}

app.on('ready', () =>{
  if (BrowserWindow.getAllWindows().length === 0) {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
    });
    win.loadFile('main-window.html');
    win.setMenu(null);
  }
});
*/


venom
  .create(
    'sessionName',
    (base64Qr, asciiQR, attempts, urlCode) => {
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      require('fs').writeFile(
        'qr-code-session.png',
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
          else {
            openQRSessionWindow();
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

  function openQRSessionWindow(){

    qrWindow = new BrowserWindow({
      width: 600,
      height: 600,
      title:"WhatsApp Bot (nominas)"
    });
    qrWindow.loadURL(url.format({
      pathname: path.join(__dirname, "qr-window.html"),
      protocol: "file",
      slashes: true
    }));
    qrWindow.setMenu(null);
    qrWindow.on("closed", () => {
      qrWindow = null;
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