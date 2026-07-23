//==========================================
// PORTAL UPA - BUSCADOR DE RESULTADOS v2.0
//==========================================

let estudiantes = [];
let indiceEstudiantes = {};

//==========================================
// CARGAR CSV
//==========================================

async function cargarDatos() {

    if (estudiantes.length > 0) return;

    const respuesta = await fetch("data/resultados.csv");
    const texto = await respuesta.text();

    const filas = texto.split("\n");

    for (let i = 1; i < filas.length; i++) {

        let columnas = filas[i].split(",");

        if (columnas.length < 2) continue;

        let nombre = columnas[0].trim();
        let nota = parseFloat(columnas[1]);

        let estudiante = {
            nombre: nombre,
            nota: nota
        };

        estudiantes.push(estudiante);

        let llave = normalizar(nombre);

        if (!indiceEstudiantes[llave]) {

            indiceEstudiantes[llave] = [];

        }

        indiceEstudiantes[llave].push(estudiante);

    }

}

//==========================================
// NORMALIZAR TEXTO
//==========================================

function normalizar(texto) {

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();

}

//==========================================
// COMPARAR NOMBRES
//==========================================

function coincide(busqueda, nombre) {

    let palabrasBusqueda = normalizar(busqueda).split(/\s+/);

    let palabrasNombre = normalizar(nombre).split(/\s+/);

    return palabrasBusqueda.every(palabra =>

        palabrasNombre.some(n => n.includes(palabra))

    );

}

//==========================================
// MOSTRAR HISTORIAL
//==========================================

function mostrarResultados(listaResultados){

    let html = `

<div class="tarjeta-resultado">

<div class="encabezado-tarjeta">

<h2>PORTAL UPA</h2>

<p>Institución Técnica Unidos por Antioquia</p>

</div>

<div class="contenido-tarjeta">

<div class="campo">

<span>👤 Estudiante</span>

<h3>${listaResultados[0].nombre}</h3>

</div>

<hr style="margin:25px 0;">

<h3 style="margin-bottom:25px;">Historial de Resultados</h3>

`;

    listaResultados.forEach((estudiante,index)=>{

        let estado="";
        let color="";

        if(estudiante.nota>=3.5){

            estado="✅ APROBADO";
            color="#198754";

        }else{

            estado="❌ NO APROBADO";
            color="#dc3545";

        }

        html+=`

<div style="margin-bottom:25px;padding:18px;border:1px solid #e5e5e5;border-radius:12px;">

<h4 style="margin-bottom:12px;color:#0B4F3A;">

Resultado ${index+1}

</h4>

<p style="font-size:20px;">

📊 <strong>Calificación:</strong> ${estudiante.nota}

</p>

<p style="font-size:22px;font-weight:bold;color:${color};">

${estado}

</p>

</div>

`;

    });    html += `

</div>

</div>

`;

    document.getElementById("resultado").innerHTML = html;

}

//==========================================
// CONSULTAR
//==========================================

async function consultar(){

    await cargarDatos();

    const texto = document.getElementById("nombre").value.trim();

    if(texto===""){

        document.getElementById("resultado").innerHTML="";

        return;

    }

    let llaveSeleccionada=null;

    // Buscar el nombre que coincide
    for(let llave in indiceEstudiantes){

        let nombreOriginal=indiceEstudiantes[llave][0].nombre;

        if(coincide(texto,nombreOriginal)){

            llaveSeleccionada=llave;

            break;

        }

    }

    if(llaveSeleccionada){

        mostrarResultados(indiceEstudiantes[llaveSeleccionada]);

    }else{

        document.getElementById("resultado").innerHTML=`

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

//==========================================
// SUGERENCIAS
//==========================================

document.addEventListener("DOMContentLoaded",async()=>{

    await cargarDatos();

    const input=document.getElementById("nombre");

    const lista=document.getElementById("sugerencias");

    input.addEventListener("input",function(){

        const texto=input.value.trim();

        lista.innerHTML="";

        if(texto==="") return;

        // Mostrar un solo nombre por estudiante
        Object.keys(indiceEstudiantes).forEach(llave=>{

            let nombre=indiceEstudiantes[llave][0].nombre;

            if(coincide(texto,nombre)){

                const item=document.createElement("div");

                item.className="item-sugerencia";

                item.textContent=nombre;

                item.onclick=function(){

                    input.value=nombre;

                    lista.innerHTML="";

                    mostrarResultados(indiceEstudiantes[llave]);

                };

                lista.appendChild(item);

            }

        });

    });

    document.addEventListener("click",function(e){

        if(!e.target.closest("#nombre") && !e.target.closest("#sugerencias")){

            lista.innerHTML="";

        }

    });

});