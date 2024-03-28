document.addEventListener("DOMContentLoaded", function () {
    let data = localStorage.getItem("cartinhas_data")

    if (data) {
        mostrarCampeao(JSON.parse(data))
    } else {
        fetch("cartinhas.json")
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("cartinhas_data", JSON.stringify(data))
                mostrarCampeao(data)
            })
            .catch(error => console.error("Erro ao obter os dados:", error))
    }

    function mostrarCampeao(data) {
        data.forEach(element => {
            console.log(element[1])
            console.log(element[2])
            console.log(element[3])
            console.log(element[7])
        });
    }
})