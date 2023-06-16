var http = require('http')
var porta = 21035
 
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('Hello Node Porta: '+ porta)
}).listen(porta)
 
console.log('Servidor rodando na porta: '+ porta)

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const https = require('https');
const fs = require('fs');
const port = process.env.port || 5000;
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
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

app.post('/consultar', (req, res) => {
  console.log('executei-1');
  const url = "https://portal.kangu.com.br/tms/transporte/simular";
  const token = "b4b9beb7bce0c1dd89f43d5e9c2f560907b5471f7e44ba710bb43633acccc249";
  const cepOrigem = "04781-000";
  const cepDestino = "04829-220";   
  const produtos = [
    {
      "vlrMerc": 600,
      "pesoMerc": 10,
      "produtos": [
        {
          "peso": 5,
          "altura": 5,
          "largura": 5,
          "comprimento": 5,
          "valor": 300,
          "quantidade": 2
        }
      ]
    }
  ];

  const bodyData = {
    cepOrigem: cepOrigem,
    cepDestino: cepDestino,
    produtos: produtos,
    vlrMerc: 600,
    pesoMerc: 10
  };
  console.log('executei-2');
  fetch(url, {
    method: "POST",
    headers: {
      "token": token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bodyData)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Erro ao consultar API externa' });
    });
});
console.log('executei-3');  
const options = {
  //key: fs.readFileSync('/privkey.pem'),
  //cert: fs.readFileSync('/cert.pem'),
  //ca: fs.readFileSync('/ca.pem')  // Adicione essa linha se estiver usando um certificado de autoridade certificadora
};

let server;

function startServer() {
  if (!server || !server.listening) {
    server = https.createServer(options, app);
    server.listen(port, () => {
      console.log("Servidor HTTPS iniciado na porta " + port);
    });

    server.on('error', function(e) {
      console.log(e)
    });
  } else {
    console.log('O servidor já está em execução.');
  }
}

// Iniciar o servidor
startServer();
console.log('funcionei');
