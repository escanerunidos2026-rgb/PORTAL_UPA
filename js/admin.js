const URL_HOJA = "https://script.google.com/macros/s/AKfycbx_DKK2VWgyDqoN_a50nDU4_8PhWSTI-6A6-yyZ3-DoALTEAXiwli3hKMg-jHaXfzcaAg/exec";

async function cargarEstadisticas() {

    const respuesta = await fetch(URL_HOJA);
    const datos = await respuesta.json();

    document.getElementById("consultas").textContent = datos.consultas;
    document.getElementById("pdf").textContent = datos.pdf;
    document.getElementById("hoy").textContent = datos.hoy;
    document.getElementById("mes").textContent = datos.mes;

}

cargarEstadisticas();