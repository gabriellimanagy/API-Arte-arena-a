const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const port = process.env.PORT || 8081;
const app = express();
const { validarCep } = require('./validations');

app.use(bodyParser.json());

const corsOptions = {
  origin: 'https://apex.oracle.com',
};

app.use(cors(corsOptions));

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

app.post('/consultar-teste', (req, res) => {
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

app.post('/consultar-kangu', (req, res) => {
  const { cepDestino, produto } = req.body;

  if (!cepDestino || !produto) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  if (!validarCep(cepDestino)) {
    return res.status(400).json({ error: 'CEP de destino inválido' });
  }

  const url = "https://portal.kangu.com.br/tms/transporte/simular";
  const token = "b4b9beb7bce0c1dd89f43d5e9c2f560907b5471f7e44ba710bb43633acccc249";

  const bodyData = {
    cepOrigem: "04781-000",
    cepDestino: cepDestino,
    vlrMerc: 600,
    pesoMerc: 10,
    produtos: [produto],
  };

  fetch(url, {
    method: "POST",
    headers: {
      "token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      res.header("Access-Control-Allow-Origin", "https://apex.oracle.com");
      res.json(data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Erro ao consultar API externa' });
    });
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

console.log('funcionei');
