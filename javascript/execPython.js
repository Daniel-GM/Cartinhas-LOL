// document.addEventListener("DOMContentLoaded", function () {
//   const { exec } = require('child_process');

//   exec('python cartinhasTimes.py', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Erro ao executar o comando: ${error}`);
//       return;
//     }
//     console.log(`Saída do Python: ${stdout}`);
//     console.error(`Erros do Python: ${stderr}`);
    
//     // Após a execução do Python, execute os outros scripts JavaScript.
//     // Este é um exemplo de como você pode chamar os outros scripts:
    
//     // Primeiro, chame o getJson.js para gerar os arquivos JSON
//     const getJsonScript = require('getJson.js');
    
//     // Em seguida, chame o script principal que depende dos arquivos JSON gerados
//     const scriptScript = require('script.js');
//   })
// })