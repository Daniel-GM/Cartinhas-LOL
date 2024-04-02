document.addEventListener("DOMContentLoaded", function () {

    function printTimes() {
        const divTimes = document.querySelector('#times')

        times()
            .then(data => {
                data.forEach(time => {
                    const div = document.createElement('div')
                    div.className = `row tabelasTimes justify-content-around ${time.replace(/ /g, '').replace(/!/g, '').toLowerCase()} mt-4 mb-4`

                    const h1 = document.createElement('h1')
                    h1.textContent = time

                    div.appendChild(h1)
                    divTimes.appendChild(div)
                })
            })
            .catch(error => console.error("Erro ao obter os dados dos times:", error))
    }

    async function printJogadores() {
        const roles = ["top.json", "jungle.json", "mid.json", "bot.json", "support.json"]

        const dados = await printTodosJogadores()
        const todosDados = await todosJogadores()

        for (const role of roles) {
            const data = await jogadores(role)
            const players = JSON.parse(data)
            

            for (const player of players) {
                const playerName = player.Player
                const timeKey = player.time.replace(/ /g, '').replace(/!/g, '').toLowerCase()
                const jogadorTable = document.querySelector(`.${timeKey}`)
                const dadosJogadores = todosDados.findIndex(score => score[0] === playerName)
                const score = dados.findIndex(score => score.jogador === playerName)
                const scorePlayer = dados[score].media

                const card = document.createElement('div')
                card.style.width = "220px"
                card.classList = "col text-center cardJogador"

                

                const divName = document.createElement('div')
                divName.classList = "text-center"
                const name = document.createElement('span')
                name.textContent = playerName
                divName.appendChild(name)
                card.appendChild(divName)

                const divScore = document.createElement('div')
                divScore.classList = "text-center"
                const scoreElement = document.createElement('span')
                scoreElement.textContent = scorePlayer.toFixed(0)
                divScore.appendChild(scoreElement)
                card.appendChild(divScore)

                const divPhoto = document.createElement('div')
                const photo = document.createElement('img')
                photo.src = `img/${playerName}.webp`
                photo.style.width = "220px"
                photo.style.height = "156px"
                divPhoto.appendChild(photo)
                card.appendChild(divPhoto)

                const games = createDataElement('Jogos', todosDados[dadosJogadores][2])
                const win = createDataElement('WinRate', todosDados[dadosJogadores][3])
                const kda = createDataElement('KDA', todosDados[dadosJogadores][5])
                const kp = createDataElement('KP%', todosDados[dadosJogadores][10])

                card.appendChild(games)
                card.appendChild(win)
                card.appendChild(kda)
                card.appendChild(kp)

                jogadorTable.appendChild(card)
            }
        }
    }

    function printTodosJogadores() {
        const roles = ["top.json", "jungle.json", "mid.json", "bot.json", "support.json"]
        const groupRole = []

        return Promise.all(roles.map(role => jogadores(role)))
            .then(async results => {
                results.forEach((data, index) => {
                    const role = roles[index].replace('.json', '')
                    JSON.parse(data).forEach(jogador => {
                        groupRole.push({ Player: jogador.Player, Role: role })
                    })
                })

                const player = []
                const winrate = []
                const kda = []
                const csm = []
                const gpm = []
                const kp = []
                const gd = []
                const csd = []
                const xpd = []
                const ranking = []

                await todosJogadores()
                    .then(data => {
                        data.forEach(row => {
                            player.push(row[0])
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

                        for (let role in maiorMenor.winrate) {
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

                        data.forEach(row => {
                            const score = []
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
                        // ranking.forEach(item => {
                        //     console.log(`${item.jogador}: ${item.media.toFixed(0)}`)
                        // })
                    })
                return ranking
            })
            .catch(error => {
                console.error('Erro ao buscar dados dos jogadores:', error)
            })
    }

    function gerarScore(valor, max, min) {
        let score, pontuacao, maxMin, maxScore = 100
        pontuacao = valor - min
        maxMin = max - min
        score = (pontuacao / maxMin) * maxScore
        return score
    }

    function createDataElement(label, value) {
        const div = document.createElement('div');
        const spanLabel = document.createElement('div');
        const spanValue = document.createElement('div');

        spanLabel.textContent = label;
        spanValue.textContent = value;

        div.classList = "row data";
        spanLabel.classList = "col-5";
        spanValue.classList = "col-7";

        div.appendChild(spanLabel);
        div.appendChild(spanValue);

        return div;
    }

    printTimes()
    printJogadores()
})