const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const https = require('https');
const fs = require('fs');
const port = 21035;
const app = express();
app.use(bodyParser.json());

app.get('/main/', (req, res) => {
  res.send('Ola, esta aplicacao esta rodando em NodeJS versao ' + process.version + ' na porta: ' + port);
});

app.post('/webhook', (req, res) => {
  const { action } = req.body;

  if (req.body.action.type === 'updateCard' && req.body.action.data.listAfter) {
    const cardName = req.body.action.data.card.name;
    const listBefore = req.body.action.data.listBefore.name;
    const listAfter = req.body.action.data.listAfter.name;

    console.log(`O card '${cardName}' foi movido da lista '${listBefore}' para a lista '${listAfter}'`);
  }

  res.sendStatus(200);
});

app.get('/teste', (req, res) => {
  res.sendStatus(200);
});

app.get('/consultar', (req, res) => {
  // Resto do código do fetch
});

const options = {
  key: fs.readFileSync('/home/sqlhelper/ssl/privkey.pem'),
  cert: fs.readFileSync('/home/sqlhelper/ssl/cert.pem'),
  //ca: fs.readFileSync('/home/sqlhelper/ssl/ca.pem')  // Adicione essa linha se estiver usando um certificado de autoridade certificadora
};


let server;

function startServer() {
  if (!server || !server.listening) {
    server = https.createServer(options, app);
    server.listen(443, () => {
      console.log("Servidor HTTPS iniciado na porta " + 443);
    });

    server.on('error', function(e) {
      console.log(e)
    })

  } else {
    console.log('O servidor já está em execução.');
  }
}

// Iniciar o servidor
startServer();