document.addEventListener("DOMContentLoaded", function () {
    let roles = ["top.json", "jungle.json", "mid.json", "bot.json", "support.json"]
    roles.forEach(role => {
        fetch(role)
            .then(response => response.text())
            .then(text => {
                const transformedText = transformInvalidJson(text)
                const data = transformedText
                localStorage.setItem("mid_data", JSON.stringify(data))
                mostrarRoles(data)
            })
            .catch(error => console.error("Erro ao obter os dados:", error))
    })

    function mostrarRoles(data) {
        if (data === null) {
            console.error("Dados nulos fornecidos para mostrar as roles")
            return
        }
        data = JSON.parse(data)
        console.log(data)
    }

    function transformInvalidJson(input) {
        input = `[\n` + input + "]"
        input = input.replace(/]/g, "],")
        output = input.slice(0, -5) + `\n]`

        return output
    }
})