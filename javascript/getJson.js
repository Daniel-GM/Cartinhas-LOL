document.addEventListener("DOMContentLoaded", function () {
    function jogadores(role) {
        return fetch(role)
            .then(response => response.text())
            .then(text => {
                const transformedText = transformarJsonJogadores(text)
                const data = transformedText
                localStorage.setItem(role, JSON.stringify(data))
                return data
            })
            .catch(error => {
                console.error("Erro ao obter os dados dos jogadore:", error)
                throw error
            })
    }

    function times() {
        return fetch("times.json")
            .then(response => response.text())
            .then(text => {
                const transformedText = transformarJsonTimes(text)
                const data = JSON.parse(transformedText)
                localStorage.setItem("times.json", JSON.stringify(data))
                return data
            })
            .catch(error => {
                console.error("Erro ao obter os dados dos times:", error)
                throw error
            })
    }

    function todosJogadores() {
        return fetch("jogadores.json")
            .then(response => response.text())
            .then(text => {
                const data = JSON.parse(text)
                localStorage.setItem("jogadores.json", JSON.stringify(data))
                return data
            })
            .catch(error => {
                console.error("Erro ao obter os dados dos times:", error)
                throw error
            })
    }

    function categoriasCammpeaoes() {
        return fetch("categoria.json")
            .then(response => response.text())
            .then(text => {
                const data = JSON.parse(text)
                localStorage.setItem("categoria.json", JSON.stringify(data))
                return data
            })
            .catch(error => {
                console.error("Erro ao obter os dados da categotia:", error)
                throw error
            })
    }

    function mostrarRoles(data) {
        if (data === null) {
            console.error("Dados nulos fornecidos para mostrar as roles")
            return
        }
        data = JSON.parse(data)
        // console.log(data)
    }

    function transformarJsonJogadores(input) {
        input = input.replace(/}}/g, "}},")
        output = input.slice(0, -1) + ``
        output = `[${output}]`

        return output
    }

    function transformarJsonTimes(input) {
        input = `[${input}]`
        output = input.replace(/\n(?!\s*])/g, ",\n")

        return output
    }

    window.categoriasCammpeaoes = categoriasCammpeaoes
    window.todosJogadores = todosJogadores
    window.jogadores = jogadores
    window.times = times
})