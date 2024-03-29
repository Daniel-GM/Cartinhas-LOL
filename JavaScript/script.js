document.addEventListener("DOMContentLoaded", function () {
    
    function printTimes() {
        const divTimes = document.querySelector('#times');

        times()
        .then(data => {
            data.forEach(time => {
                const jogadorTable = document.createElement('table');
                jogadorTable.classList.add('jogador-table');

                const jogadorHeadRow = document.createElement('tr');
                const jogadorNameHead = document.createElement('th');
                jogadorNameHead.textContent = 'Nome';
                const campeaoHead = document.createElement('th');
                campeaoHead.textContent = 'Campeão';
                const vezesJogadasHead = document.createElement('th');
                vezesJogadasHead.textContent = 'Vezes Jogadas';
                const kdaHead = document.createElement('th');
                kdaHead.textContent = 'KDA';
                const winrateHead = document.createElement('th');
                winrateHead.textContent = 'Winrate';

                jogadorHeadRow.appendChild(jogadorNameHead);
                jogadorHeadRow.appendChild(campeaoHead);
                jogadorHeadRow.appendChild(vezesJogadasHead);
                jogadorHeadRow.appendChild(kdaHead);
                jogadorHeadRow.appendChild(winrateHead);
                jogadorTable.appendChild(jogadorHeadRow);


                const div = document.createElement('div')
                div.className = `row tabelasTimes justify-content-center ${time.replace(/ /g, '').replace(/!/g, '').toLowerCase()}`
                
                const h2 = document.createElement('h2')
                h2.textContent = time

                div.appendChild(h2)
                divTimes.appendChild(div)
                div.appendChild(jogadorTable); // Adicionando a tabela dentro da div de cada time
            });
        })
        .catch(error => console.error("Erro ao obter os dados dos times:", error));
    }

    function printJogadores() {
        const roles = ["top.json", "jungle.json", "mid.json", "bot.json", "support.json"];

        roles.forEach(role => {
            jogadores(role)
                .then(data => {
                    data = JSON.parse(data);
                    for (let index = 0; index < data.length; index++) {
                        const timeKey = data[index].time.replace(/ /g, '').replace(/!/g, '').toLowerCase();
                        const jogadorTable = document.querySelector(`.${timeKey} table.jogador-table`); // Selecionando a tabela do jogador dentro do respectivo time

                        const jogadorRow = document.createElement('tr');

                        const jogadorNameCell = document.createElement('td');
                        jogadorNameCell.textContent = data[index].Player;

                        const campeaoChampionCell = document.createElement('td');
                        campeaoChampionCell.textContent = data[index].Campeao.Champion;

                        const timesPlayedCell = document.createElement('td');
                        timesPlayedCell.textContent = data[index].Campeao['Times Played'];

                        const kdaCell = document.createElement('td');
                        kdaCell.textContent = data[index].Campeao.KDA;

                        const winrateCell = document.createElement('td');
                        winrateCell.textContent = data[index].Campeao.Winrate;

                        jogadorRow.appendChild(jogadorNameCell);
                        jogadorRow.appendChild(campeaoChampionCell);
                        jogadorRow.appendChild(timesPlayedCell);
                        jogadorRow.appendChild(kdaCell);
                        jogadorRow.appendChild(winrateCell);
                        
                        jogadorTable.appendChild(jogadorRow);
                    }
                })
                .catch(error => console.error("Erro ao obter os dados dos times:", error));
        });
    }

    printTimes();
    printJogadores();
});
