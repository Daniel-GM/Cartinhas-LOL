document.addEventListener("DOMContentLoaded", function () {
    
    function printTimes() {
        const timesDOM = document.querySelectorAll(".time")
        const divTimes = document.querySelector('#times')

        times()
        .then(data => {
            data.forEach(time => {
                const div = document.createElement('div')
                div.className = `row tabelasTimes justify-content-center ${time.replace(/ /g, '').replace(/!/g, '').toLowerCase()}`
                
                const h2 = document.createElement('h2')
                h2.textContent = time

                div.appendChild(h2)
                divTimes.appendChild(div)
            })
        })
        .catch(error => console.error("Erro ao obter os dados dos times:", error))
    }

    function printJogadores() {
        const roles = ["top.json", "jungle.json", "mid.json", "bot.json", "support.json"]
        const timesDOM = document.querySelectorAll(".time")
    
        roles.forEach(role => {
            jogadores(role)
            .then(data => {
                data = JSON.parse(data)
    
                for (let index = 0; index < data.length; index++) {
                    const time = document.querySelector(`.${data[index].time.replace(/ /g, '').replace(/!/g, '').toLowerCase()}`)
                    const jogadorList = document.createElement('ol')
                    const jogadorItem = document.createElement('li')
                    
                console.log(data[index].Campeao)

                /*
                    Champion: "KSante"
                    KDA: "1.8"
                    Times Played: "5"
                    Winrate: "40%"
                */

                    jogadorItem.textContent = `${data[index].Player} Campeao mais jogado: ${data[index].Campeao.Champion} com ${data[index].Campeao['Times Played']} jogos | KDA de ${data[index].Campeao.Champion}: ${data[index].Campeao.KDA} | WinRate de ${data[index].Campeao.Winrate} `
                    
                    jogadorList.appendChild(jogadorItem)
                    
                    time.appendChild(jogadorList) 
                }
            })
            .catch(error => console.error("Erro ao obter os dados dos times:", error))
        })
    }
    

    printTimes()
    printJogadores()
})
