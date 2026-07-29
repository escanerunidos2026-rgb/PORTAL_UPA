const URL_HOJA = "https://script.google.com/macros/s/AKfycbyvoGf2LBAtNsAzBjcBm5ziI1Hx7AjMMkLjOivyWVmCZg-ULW3OimZmZaqTyniWpjgunA/exec";

async function cargarEstadisticas() {
    try {
        const respuesta = await fetch(URL_HOJA);
        const datos = await respuesta.json();

        document.getElementById("consultas").textContent = datos.consultas;
        document.getElementById("pdf").textContent = datos.pdfs;
        document.getElementById("hoy").textContent = datos.visitantesHoy;
        document.getElementById("mes").textContent = datos.visitantesMes;

    } catch (error) {
        console.error("Error al cargar estadísticas:", error);
    }
}

cargarEstadisticas();