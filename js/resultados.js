let estudiantes = [];

//==============================
// CARGAR CSV
//==============================

async function cargarDatos() {

    if (estudiantes.length > 0) return;

    const respuesta = await fetch("data/resultados.csv");

    const texto = await respuesta.text();

    const filas = texto.split("\n");

    for (let i = 1; i < filas.length; i++) {

        let columnas = filas[i].split(",");

        if (columnas.length < 2) continue;

        estudiantes.push({

            nombre: columnas[0].trim(),

            nota: parseFloat(columnas[1])

        });

    }

}

//==============================
// NORMALIZAR TEXTO
//==============================

function normalizar(texto) {

    return texto

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .toUpperCase()

        .trim();

}

//==============================
// BUSCAR COINCIDENCIA
//==============================

function coincide(busqueda, nombre) {

    let palabrasBusqueda = normalizar(busqueda).split(/\s+/);

    let palabrasNombre = normalizar(nombre).split(/\s+/);

    return palabrasBusqueda.every(palabra =>

        palabrasNombre.some(n => n.includes(palabra))

    );

}

//==============================
// MOSTRAR RESULTADO
//==============================

function mostrarResultado(estudiante) {

    let estado = "";
    let clase = "";

    if (estudiante.nota >= 3.5) {

        estado = "✅ APROBADO";
        clase = "aprobado";

    } else {

        estado = "❌ NO APROBADO";
        clase = "no-aprobado";

    }

    document.getElementById("resultado").innerHTML = `

<div class="tarjeta-resultado ${clase}">

<div class="encabezado-tarjeta">

<h2>PORTAL UPA</h2>

<p>Institución Técnica Unidos por Antioquia</p>

</div>

<div class="contenido-tarjeta">

<div class="campo">

<span>👤 Estudiante</span>

<h3>${estudiante.nombre}</h3>

</div>

<div class="campo">

<span>📊 Calificación Final</span>

<h1>${estudiante.nota}</h1>

</div>

<div class="estado">

${estado}

</div>

</div>

</div>

`;

}

//==============================
// CONSULTAR
//==============================

async function consultar() {

    await cargarDatos();

    let texto = document.getElementById("nombre").value;

    let estudiante = estudiantes.find(e => coincide(texto, e.nombre));

    if (estudiante) {

        mostrarResultado(estudiante);

    } else {

        document.getElementById("resultado").innerHTML = `

<div class="tarjeta-resultado no-aprobado">

<div class="encabezado-tarjeta">

<h2>Resultado no encontrado</h2>

</div>

<div class="contenido-tarjeta">

<p>No existe información para el nombre ingresado.</p>

</div>

</div>

`;

    }

}

//==============================
// SUGERENCIAS
//==============================

document.addEventListener("DOMContentLoaded", async () => {

    await cargarDatos();

    const input = document.getElementById("nombre");

    const lista = document.getElementById("sugerencias");

    input.addEventListener("input", function () {

        let texto = input.value;

        lista.innerHTML = "";

        if (texto.length == 0) return;

        let encontrados = estudiantes.filter(e => coincide(texto, e.nombre));

        encontrados.slice(0, 8).forEach(estudiante => {

            let item = document.createElement("div");

            item.className = "item-sugerencia";

            item.textContent = estudiante.nombre;

            item.onclick = function () {

                input.value = estudiante.nombre;

                lista.innerHTML = "";

                mostrarResultado(estudiante);

            };

            lista.appendChild(item);

        });

    });

    document.addEventListener("click", function (e) {

        if (!e.target.closest("#nombre")) {

            lista.innerHTML = "";

        }

    });

});