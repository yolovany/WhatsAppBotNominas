// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

venom
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

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