// Função para validar o CEP
function validarCep(cep) {
    // Remover caracteres não numéricos do CEP
    const cepNumerico = cep.replace(/\D/g, '');
  
    // Verificar se o CEP possui o tamanho correto
    if (cepNumerico.length !== 8) {
      return false;
    }
  
    // Verificar se todos os caracteres do CEP são iguais
    const primeiroDigito = cepNumerico.charAt(0);
    if (cepNumerico.split('').every(digito => digito === primeiroDigito)) {
      return false;
    }
  
    // Verificar se o CEP é válido (adicionar sua lógica de validação personalizada aqui, se necessário)
  
    // Se chegou até aqui, o CEP é considerado válido
    return true;
  }

module.exports = {
validarCep
};