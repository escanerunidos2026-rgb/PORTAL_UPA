const URL_HOJA = "https://script.google.com/macros/s/AKfycby-_v7Fz0twg_lX6KsRzSSmNt_5W272mK5w9ZU8YtiLmH9AsICk9HRt7iUpKgbSfgikvw/exec";
let visitante = localStorage.getItem("visitanteUPA");

if (!visitante) {
    visitante = crypto.randomUUID();
    localStorage.setItem("visitanteUPA", visitante);
}

fetch(URL_ESTADISTICAS + "?accion=Visita&id=" + visitante)
    .catch(() => {});