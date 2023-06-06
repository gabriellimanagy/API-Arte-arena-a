var http = require('http')
var porta = 21035
 
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('Hello Node Porta: '+ porta)
}).listen(porta)
 
console.log('Servidor rodando na porta: '+ porta)
