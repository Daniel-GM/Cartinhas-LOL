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
                    div.appendChild(jogadorTable);
                });
            })
            .catch(error => console.error("Erro ao obter os dados dos times:", error));
    }

    function printJogadores() {
        const roles = ["top.json", "jungle.json", "mid.json", "bot.json", "support.json"];
        const scores = printTodosJogadores()

        roles.forEach(role => {
            jogadores(role)
                .then(data => {
                    // console.log(data)
                    data = JSON.parse(data)
                    // console.log(data)
                    for (let index = 0; index < data.length; index++) {
                        const timeKey = data[index].time.replace(/ /g, '').replace(/!/g, '').toLowerCase();
                        const jogadorTable = document.querySelector(`.${timeKey} table.jogador-table`);

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

    function printTodosJogadores() {
        const roles = ["top.json", "jungle.json", "mid.json", "bot.json", "support.json"]
        const groupRole = []
    
        roles.forEach(role => {
            jogadores(role)
                .then(data => {
                    role = role.replace('.json', '')
                    JSON.parse(data).forEach(jogador => {
                        groupRole.push({Player: jogador.Player, Role: role})
                    })
                })
        })
    
        const player = []
        const game = []
        const winrate = []
        const kda = []
        const csm = []
        const gpm = []
        const kp = []
        const gd = []
        const csd = []
        const xpd = []
        const ranking = []
    
        todosJogadores()
            .then(data => {
                data.forEach(row => {
                    player.push(row[0])
                    game.push(row[2])
                    winrate.push(parseFloat(row[3].replace('%', '')))
                    kda.push(row[4])
                    csm.push(row[8])
                    gpm.push(row[9])
                    kp.push(parseFloat(row[10].replace('%', '')))
                    gd.push(row[17])
                    csd.push(row[18])
                    xpd.push(row[19])
                    row[24] = groupRole.find(player => player.Player === row[0]).Role
                })
    
                const maiorMenor = {
                    game: {},
                    winrate: {},
                    kda: {},
                    csm: {},
                    gpm: {},
                    kp: {},
                    dmg: {},
                    gd: {},
                    csd: {},
                    xpd: {}
                }
    
                roles.forEach(role => {
                    maiorMenor.game[role] = { max: -Infinity, min: Infinity }
                    maiorMenor.winrate[role] = { max: -Infinity, min: Infinity }
                    maiorMenor.kda[role] = { max: -Infinity, min: Infinity }
                    maiorMenor.csm[role] = { max: -Infinity, min: Infinity }
                    maiorMenor.gpm[role] = { max: -Infinity, min: Infinity }
                    maiorMenor.kp[role] = { max: -Infinity, min: Infinity }
                    maiorMenor.dmg[role] = { max: -Infinity, min: Infinity }
                    maiorMenor.gd[role] = { max: -Infinity, min: Infinity }
                    maiorMenor.csd[role] = { max: -Infinity, min: Infinity }
                    maiorMenor.xpd[role] = { max: -Infinity, min: Infinity }
                })
    
                data.forEach(row => {
                    const currentRole = groupRole.find(player => player.Player === row[0]).Role
                    const role = currentRole + '.json'
                    maiorMenor.game[role].max = Math.max(maiorMenor.game[role].max, row[2])
                    maiorMenor.game[role].min = Math.min(maiorMenor.game[role].min, row[2])
                    maiorMenor.winrate[role].max = Math.max(maiorMenor.winrate[role].max, parseFloat(row[3].replace('%', '')))
                    maiorMenor.winrate[role].min = Math.min(maiorMenor.winrate[role].min, parseFloat(row[3].replace('%', '')))
                    maiorMenor.kda[role].max = Math.max(maiorMenor.kda[role].max, row[4])
                    maiorMenor.kda[role].min = Math.min(maiorMenor.kda[role].min, row[4])
                    maiorMenor.csm[role].max = Math.max(maiorMenor.csm[role].max, row[8])
                    maiorMenor.csm[role].min = Math.min(maiorMenor.csm[role].min, row[8])
                    maiorMenor.gpm[role].max = Math.max(maiorMenor.gpm[role].max, row[9])
                    maiorMenor.gpm[role].min = Math.min(maiorMenor.gpm[role].min, row[9])
                    maiorMenor.kp[role].max = Math.max(maiorMenor.kp[role].max, parseFloat(row[10].replace('%', '')))
                    maiorMenor.kp[role].min = Math.min(maiorMenor.kp[role].min, parseFloat(row[10].replace('%', '')))
                    maiorMenor.dmg[role].max = Math.max(maiorMenor.dmg[role].max, parseFloat(row[11].replace('%', '')))
                    maiorMenor.dmg[role].min = Math.min(maiorMenor.dmg[role].min, parseFloat(row[11].replace('%', '')))
                    maiorMenor.gd[role].max = Math.max(maiorMenor.gd[role].max, row[17])
                    maiorMenor.gd[role].min = Math.min(maiorMenor.gd[role].min, row[17])
                    maiorMenor.csd[role].max = Math.max(maiorMenor.csd[role].max, row[18])
                    maiorMenor.csd[role].min = Math.min(maiorMenor.csd[role].min, row[18])
                    maiorMenor.xpd[role].max = Math.max(maiorMenor.xpd[role].max, row[19])
                    maiorMenor.xpd[role].min = Math.min(maiorMenor.xpd[role].min, row[19])
                })
    
                for (let role in maiorMenor.game) {
                    maiorMenor.game[role] = [maiorMenor.game[role].max, maiorMenor.game[role].min]
                    maiorMenor.winrate[role] = [maiorMenor.winrate[role].max, maiorMenor.winrate[role].min]
                    maiorMenor.kda[role] = [maiorMenor.kda[role].max, maiorMenor.kda[role].min]
                    maiorMenor.csm[role] = [maiorMenor.csm[role].max, maiorMenor.csm[role].min]
                    maiorMenor.gpm[role] = [maiorMenor.gpm[role].max, maiorMenor.gpm[role].min]
                    maiorMenor.kp[role] = [maiorMenor.kp[role].max, maiorMenor.kp[role].min]
                    maiorMenor.dmg[role] = [maiorMenor.dmg[role].max, maiorMenor.dmg[role].min]
                    maiorMenor.gd[role] = [maiorMenor.gd[role].max, maiorMenor.gd[role].min]
                    maiorMenor.csd[role] = [maiorMenor.csd[role].max, maiorMenor.csd[role].min]
                    maiorMenor.xpd[role] = [maiorMenor.xpd[role].max, maiorMenor.xpd[role].min]
                }

                // roles.forEach(role => {
                //     console.log(role)
                //     console.log("Jogos: " + maiorMenor.game[role])
                //     console.log("Winrate: " + maiorMenor.winrate[role])
                //     console.log("KDA: " + maiorMenor.kda[role])
                //     console.log("CSM: " + maiorMenor.csm[role])
                //     console.log("GPM: " + maiorMenor.gpm[role])
                //     console.log("KP%: " + maiorMenor.kp[role])
                //     console.log("GD@15: " + maiorMenor.gd[role])
                //     // console.log("CSD@15: " + maiorMenor.csd[role])
                //     console.log("XPD@15: " + maiorMenor.xpd[role])
                // })

                data.forEach(row => {
                    const score = []
                    // score.push(gerarScore(row[2], maiorMenor.game[row[24] + '.json'][0], maiorMenor.game[row[24] + '.json'][1]))
                    score.push(gerarScore(parseFloat(row[3].replace('%', '')), maiorMenor.winrate[row[24] + '.json'][0], maiorMenor.winrate[row[24] + '.json'][1]))
                    score.push(gerarScore(row[4], maiorMenor.kda[row[24] + '.json'][0], maiorMenor.kda[row[24] + '.json'][1]))
                    score.push(gerarScore(row[8], maiorMenor.csm[row[24] + '.json'][0], maiorMenor.csm[row[24] + '.json'][1]))
                    score.push(gerarScore(row[9], maiorMenor.gpm[row[24] + '.json'][0], maiorMenor.gpm[row[24] + '.json'][1]))
                    score.push(gerarScore(parseFloat(row[10].replace('%', '')), maiorMenor.kp[row[24] + '.json'][0], maiorMenor.kp[row[24] + '.json'][1]))
                    score.push(gerarScore(parseFloat(row[11].replace('%', '')), maiorMenor.dmg[row[24] + '.json'][0], maiorMenor.dmg[row[24] + '.json'][1]))
                    score.push(gerarScore(row[17], maiorMenor.gd[row[24] + '.json'][0], maiorMenor.gd[row[24] + '.json'][1]))
                    score.push(gerarScore(row[18], maiorMenor.csd[row[24] + '.json'][0], maiorMenor.csd[row[24] + '.json'][1]))
                    score.push(gerarScore(row[19], maiorMenor.xpd[row[24] + '.json'][0], maiorMenor.xpd[row[24] + '.json'][1]))
    
                    let media = 0
                    for (let index = 0; index < score.length; index++) {
                        media += score[index]
                    }
                    media /= score.length
                    ranking.push({ jogador: row[0], media: media })
                })
    
                ranking.sort((a, b) => b.media - a.media)
                ranking.forEach(item => {
                    console.log(`${item.jogador}: ${item.media.toFixed(0)}`)
                })

                return ranking
            })
    }
    
    function gerarScore(valor, max, min) {
        let score, pontuacao, maxMin, maxScore = 100
        pontuacao = valor - min
        maxMin = max - min
        score = (pontuacao / maxMin) * maxScore
        return score
    }
    

    printTimes()
    printJogadores()
})