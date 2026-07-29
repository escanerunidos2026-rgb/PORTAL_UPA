const URL_HOJA = "https://script.google.com/macros/s/AKfycby-_v7Fz0twg_lX6KsRzSSmNt_5W272mK5w9ZU8YtiLmH9AsICk9HRt7iUpKgbSfgikvw/exec";

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