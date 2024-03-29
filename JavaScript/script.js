document.addEventListener("DOMContentLoaded", function () {
    let data = localStorage.getItem("cartinhas_data")

    if (data) {
        localStorage.clear()
    }

    fetch("cartinhas.json")
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("cartinhas_data", JSON.stringify(data))
            mostrarCampeao(data)
        })
        .catch(error => console.error("Erro ao obter os dados:", error))

    function mostrarCampeao(data) {
        data.forEach(element => {
            if(element[1] != undefined) console.log(element[1])
            if(element[2] != undefined) console.log(element[2])
            if(element[3] != undefined) console.log(element[3])
            if(element[7] != undefined) console.log(element[7])
        });
    }
})