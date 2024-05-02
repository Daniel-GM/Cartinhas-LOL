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

                const categoria = await getCategoria(player.Campeao.Champion)

                gerarCarta(
                    player.Campeao, 
                    categoria,
                    playerName, 
                    timeKey,
                    todosDados[dadosJogadores][1],
                    todosDados[dadosJogadores][2], 
                    todosDados[dadosJogadores][3], 
                    todosDados[dadosJogadores][5], 
                    todosDados[dadosJogadores][10], 
                    scorePlayer,
                    jogadorTable
                )
            }
        }
        scoreTimes()
    }

    async function dreamTeam() {
        const roles = ["top.json", "jungle.json", "mid.json", "bot.json", "support.json"]

        const dados = await printTodosJogadores()
        const todosDados = await todosJogadores()

        let melhorLaner
        let dreamTeam = []

        for (const role of roles) {
            const data = await jogadores(role)
            const players = JSON.parse(data)
            let timeKey
            let filterPlayers = []            

            for (let index = 0; index < players.length; index++) {
                filterPlayers.push(players[index].Player)
            }

            for (let index = 0; index < dados.length; index++) {
                melhorLaner = filterPlayers.findIndex(score => score == dados[index].jogador)
                if (melhorLaner != -1) {
                    index = dados.length
                    dreamTeam.push(filterPlayers[melhorLaner])
                    timeKey = players[melhorLaner].time.replace(/ /g, '').replace(/!/g, '').toLowerCase()
                }
            }

            const jogadorTable = document.querySelector(".dreamTeam")
            const playerName = dreamTeam[dreamTeam.length - 1]
            const dadosJogadores = todosDados.findIndex(score => score[0] === playerName)
            const score = dados.findIndex(score => score.jogador === playerName)
            const scorePlayer = dados[score].media
            const indexPlayers = players.findIndex(score => score.Player === playerName)

            const categoria = await getCategoria(players[indexPlayers].Campeao.Champion)

            gerarCarta(
                players[indexPlayers].Campeao, 
                categoria,
                playerName, 
                timeKey,
                todosDados[dadosJogadores][1],
                todosDados[dadosJogadores][2], 
                todosDados[dadosJogadores][3], 
                todosDados[dadosJogadores][5], 
                todosDados[dadosJogadores][10], 
                scorePlayer,
                jogadorTable
            )
        }
    }

    async function mvp() {
        let campeaoMVP
        const roles = ["top.json", "jungle.json", "mid.json", "bot.json", "support.json"]

        const dados = await printTodosJogadores()
        const todosDados = await todosJogadores()
        const jogadorTable = document.querySelector(".mvp")
        const playerName = dados[0].jogador
        const scorePlayer = dados[0].media
        let timeKey

        const dadosJogadores = todosDados.findIndex(score => score[0] === dados[0].jogador)

        for (const role of roles) {
            const data = await jogadores(role)
            const players = JSON.parse(data)

            const indexPlayers = players.findIndex(score => score.Player === playerName)

            if (indexPlayers !== -1) {
                campeaoMVP = players[indexPlayers]
                timeKey = players[indexPlayers].time.replace(/ /g, '').replace(/!/g, '').toLowerCase()
                break
            }
        }

        const categoria = await getCategoria(campeaoMVP.Campeao.Champion)

        gerarCarta(
            campeaoMVP.Campeao,
            categoria,
            playerName, 
            timeKey,
            todosDados[dadosJogadores][1],
            todosDados[dadosJogadores][2], 
            todosDados[dadosJogadores][3], 
            todosDados[dadosJogadores][5], 
            todosDados[dadosJogadores][10], 
            scorePlayer,
            jogadorTable
        )
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
                const ranking = []

                await todosJogadores()
                    .then(data => {
                        data.forEach(row => {
                            player.push(row[0])
                            row[24] = groupRole.find(player => player.Player === row[0]).Role
                        })

                        const maiorMenor = {
                            winrate: {},
                            kda: {},
                            kp: {},
                            wpm: {},
                            wcpm: {},
                            gd: {},
                            csd: {},
                            xpd: {}
                        }

                        roles.forEach(role => {
                            maiorMenor.winrate[role] = { max: -Infinity, min: Infinity }
                            maiorMenor.kda[role] = { max: -Infinity, min: Infinity }
                            maiorMenor.kp[role] = { max: -Infinity, min: Infinity }
                            maiorMenor.wpm[role] = { max: -Infinity, min: Infinity }
                            maiorMenor.wcpm[role] = { max: -Infinity, min: Infinity }
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

                            maiorMenor.kp[role].max = Math.max(maiorMenor.kp[role].max, parseFloat(row[10].replace('%', '')))
                            maiorMenor.kp[role].min = Math.min(maiorMenor.kp[role].min, parseFloat(row[10].replace('%', '')))

                            maiorMenor.wpm[role].max = Math.max(maiorMenor.wpm[role].max, row[14])
                            maiorMenor.wpm[role].min = Math.min(maiorMenor.wpm[role].min, row[14])
                        
                            maiorMenor.wcpm[role].max = Math.max(maiorMenor.wcpm[role].max, row[15])
                            maiorMenor.wcpm[role].min = Math.min(maiorMenor.wcpm[role].min, row[15])
                        
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
                            maiorMenor.kp[role] = [maiorMenor.kp[role].max, maiorMenor.kp[role].min]
                            maiorMenor.wpm[role] = [maiorMenor.wpm[role].max, maiorMenor.wpm[role].min]
                            maiorMenor.wcpm[role] = [maiorMenor.wcpm[role].max, maiorMenor.wcpm[role].min]
                            maiorMenor.gd[role] = [maiorMenor.gd[role].max, maiorMenor.gd[role].min]
                            maiorMenor.csd[role] = [maiorMenor.csd[role].max, maiorMenor.csd[role].min]
                            maiorMenor.xpd[role] = [maiorMenor.xpd[role].max, maiorMenor.xpd[role].min]
                        }

                        const percentualBase = [40, 12.5, 12.5, 12.5, 12.5, 3.3, 3.3, 3.4]

                        data.forEach(row => {
                            const score = []
                            score.push(gerarScore(parseFloat(row[3].replace('%', '')), maiorMenor.winrate[row[24] + '.json'][0], 0, percentualBase[0]))
                            score.push(gerarScore(row[4], maiorMenor.kda[row[24] + '.json'][0], 0, percentualBase[1]))
                            score.push(gerarScore(parseFloat(row[10].replace('%', '')), maiorMenor.kp[row[24] + '.json'][0], 0, percentualBase[2]))
                            score.push(gerarScore(row[14], maiorMenor.wpm[row[24] + '.json'][0], 0, percentualBase[3]))
                            score.push(gerarScore(row[15], maiorMenor.wcpm[row[24] + '.json'][0], 0, percentualBase[4]))
                            score.push(gerarScore(row[17], maiorMenor.gd[row[24] + '.json'][0], maiorMenor.gd[row[24] + '.json'][1], percentualBase[5]))
                            score.push(gerarScore(row[18], maiorMenor.csd[row[24] + '.json'][0], maiorMenor.csd[row[24] + '.json'][1], percentualBase[6]))
                            score.push(gerarScore(row[19], maiorMenor.xpd[row[24] + '.json'][0], maiorMenor.xpd[row[24] + '.json'][1], percentualBase[7]))


                            let media = 0
                            for (let index = 0; index < score.length; index++) {
                                media += score[index]
                            }
                            ranking.push({ jogador: row[0], media: media })
                        })
                        ranking.sort((a, b) => b.media - a.media)
                    })
                return ranking
            })
            .catch(error => {
                console.error('Erro ao buscar dados dos jogadores:', error)
            })
    }

    function gerarScore(valor, max, min, percentual) {
        if(valor == "-") {
            valor = 1
            max = 1
            min = 0
        }

        let score, pontuacao, maxMin, maxScore = percentual
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
        spanLabel.classList = "col";
        spanValue.classList = "col";

        div.appendChild(spanLabel);
        div.appendChild(spanValue);

        return div;
    }

    function scoreTimes() {
        const scoreTimes = document.querySelectorAll("#times .scorePlayer")
        const totalScoreTime = []
        let index = 0
        let aux = 0

        scoreTimes.forEach(scoreTime => {
            if (aux == 0) {
                totalScoreTime[index] = 0
            }
            const valor = scoreTime.textContent
            totalScoreTime[index] += parseInt(valor)
            aux++
            if (aux == 5) {
                totalScoreTime[index] /= aux
                aux = 0
                index++
            }
        })

        const times = document.querySelectorAll("#times .tabelasTimes h1")
        times.forEach(time => {
            time.textContent += ` - ${totalScoreTime[aux].toFixed(0)}`
            aux++
        })
    }

    function gerarCarta(imageChampion, categoria, playerName, imgTeam, imgCountry, dataGames, dataWin, dataKda, dataKp, scorePlayer, jogadorTable) {
        const cardComplete = document.createElement('div')
        cardComplete.style.width = "330px"
        cardComplete.classList = "col text-center cardComplete mt-2"
        cardComplete.onclick = function () {
            this.classList.toggle('flipped')
        }
        cardComplete.style.backgroundImage = "url('img/campeao/RiotX_ChampionList_" + imageChampion.Champion.toLowerCase() + ".jpg')"
        cardComplete.style.backgroundSize = "cover"
        cardComplete.style.backgroundPosition = "center"
        cardComplete.style.backgroundRepeat = "no-repeat"
        cardComplete.style.borderRadius = "8px"

        const card = document.createElement('div')
        card.style.width = "330px"
        card.classList = "col text-center cardJogador " + chooseColor(scorePlayer.toFixed(0))

        const cardChampion = document.createElement('div')
        cardChampion.style.width = "330px"
        cardChampion.classList = "col text-center cardChampion"

        const divIconChampion = document.createElement('div')
        divIconChampion.classList = "divIconChampion"
        cardChampion.appendChild(divIconChampion)
        
        const iconChampion = document.createElement('img')
        iconChampion.classList = "iconChampion"
        iconChampion.style.backgroundColor = `#000`
        iconChampion.style.borderRadius = `8px`
        iconChampion.src = `img/icon-champion/Title ${categoria}.png`
        divIconChampion.appendChild(iconChampion)

        const divWinrateChampion = document.createElement('div')
        divWinrateChampion.classList = "divWinrateChampion"
        cardChampion.appendChild(divWinrateChampion)
        
        const spanWinrateChampion = document.createElement('span')
        spanWinrateChampion.textContent = "Winrate"
        const spanWinrateData = document.createElement('span')
        spanWinrateData.textContent = imageChampion.Winrate
        divWinrateChampion.appendChild(spanWinrateChampion)
        divWinrateChampion.appendChild(spanWinrateData)

        const divKdaChampion = document.createElement('div')
        divKdaChampion.classList = "divKdaChampion"
        cardChampion.appendChild(divKdaChampion)

        const spanKdaChampion = document.createElement('span')
        spanKdaChampion.textContent = "KDA"
        const spanKdaData = document.createElement('span')
        spanKdaData.textContent = imageChampion.KDA
        divKdaChampion.appendChild(spanKdaChampion)
        divKdaChampion.appendChild(spanKdaData)

        const divPlayedChampion = document.createElement('div')
        divPlayedChampion.classList = "divPlayedChampion"
        cardChampion.appendChild(divPlayedChampion)

        const spanPlayedChampion = document.createElement('span')
        spanPlayedChampion.textContent = "Jogadas"
        const spanPlayedData = document.createElement('span')
        spanPlayedData.textContent = imageChampion["Times Played"]
        divPlayedChampion.appendChild(spanPlayedChampion)
        divPlayedChampion.appendChild(spanPlayedData)
        
        const nameChampion = document.createElement('span')
        nameChampion.classList = "nameChampion"
        nameChampion.textContent = imageChampion.Champion
        divIconChampion.appendChild(nameChampion)


        const divName = document.createElement('div')
        divName.classList = "text-center"
        const name = document.createElement('span')
        name.textContent = playerName
        divName.appendChild(name)
        card.appendChild(divName)

        const divScore = document.createElement('div')
        divScore.classList = "text-center scorePlayer"
        const scoreElement = document.createElement('span')
        scoreElement.textContent = scorePlayer.toFixed(0)
        divScore.appendChild(scoreElement)
        card.appendChild(divScore)

        const divPhoto = document.createElement('div')
        divPhoto.className = "photo-player"
        const photo = document.createElement('img')
        photo.src = `img/${playerName}.webp`
        photo.style.maxWidth = "232px"
        photo.style.height = "150px"
        divPhoto.appendChild(photo)
        card.appendChild(divPhoto)

        const country = document.createElement('img')
        country.className = "country-class"
        country.src = `img/country/${imgCountry}.png`
        divPhoto.appendChild(country)

        const team = document.createElement('img')
        team.className = "team-class"
        team.src = `img/team/${imgTeam}.webp`
        divPhoto.appendChild(team)

        const games = createDataElement('Jogos', dataGames)
        const win = createDataElement('WinRate', dataWin)
        const kda = createDataElement('KDA', dataKda)
        const kp = createDataElement('KP%', dataKp)

        card.appendChild(games)
        card.appendChild(win)
        card.appendChild(kda)
        card.appendChild(kp)

        cardComplete.appendChild(card)
        cardComplete.appendChild(cardChampion)
        jogadorTable.appendChild(cardComplete)
    }

    function chooseColor(score) {
        if(score >= 0 && score <= 19) return 'score0-19';
        else if(score >= 20 && score <= 39) return 'score20-39';
        else if(score >= 40 && score <= 59) return 'score40-59';
        else if(score >= 60 && score <= 79) return 'score60-79';
        else if(score >= 80 && score <= 89) return 'score80-89';
        else if(score >= 90 && score <= 95) return 'score90-95';
        else if(score >= 96 && score <= 99) return 'score96-99';
        else if(score == 100) return 'score100';
    }

    async function getCategoria(campeao) {
        const campeoesDados = await categoriasCammpeaoes()
        let categoria

        for (let classe in campeoesDados) {
            const index = campeoesDados[classe].findIndex(name => name === campeao)
            if(index != -1) {
                categoria = classe
                break
            }
        }
        return categoria
    }

    printTimes()
    printJogadores()
    dreamTeam()
    mvp()
})