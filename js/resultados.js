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
document.getElementById("btnPDF").style.display = "inline-block";

}

//==========================================
// CONSULTAR
//==========================================

async function consultar(){

    await cargarDatos();

    const texto = document.getElementById("nombre").value.trim();

    if(texto===""){
document.getElementById("btnPDF").style.display = "none";
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

});//==========================================
// DESCARGAR RESULTADO EN PDF
//==========================================

function descargarPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nombre = document.querySelector(".campo h3")?.textContent || "";

    const logo = new Image();

    // Cambia esta ruta por donde tengas el logo
    logo.src = "img/logo.png";

    logo.onload = function () {

        // Logo
        doc.addImage(logo, "PNG", 15, 10, 28, 28);

        // Encabezado
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("PORTAL UPA", 105, 20, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text("Institución Técnica Unidos por Antioquia", 105, 28, { align: "center" });

        doc.line(15, 42, 195, 42);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("RESULTADO DEL EXAMEN", 105, 55, { align: "center" });

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Estudiante:", 20, 70);

        doc.setFont("helvetica", "bold");
        doc.text(nombre, 50, 70);

        let y = 90;

        const resultados = document.querySelectorAll(".contenido-tarjeta > div[style]");

        resultados.forEach((resultado, index) => {

            const textos = resultado.querySelectorAll("p");

            const nota = textos[0].innerText.replace("📊 ", "");
            const estado = textos[1].innerText;

            doc.setDrawColor(180);
            doc.roundedRect(20, y - 8, 170, 30, 3, 3);

            doc.setFont("helvetica", "bold");
            doc.text("Resultado " + (index + 1), 25, y);

            doc.setFont("helvetica", "normal");
            doc.text(nota, 25, y + 8);

            if (estado.includes("APROBADO")) {
                doc.setTextColor(0, 130, 0);
            } else {
                doc.setTextColor(200, 0, 0);
            }

            doc.setFont("helvetica", "bold");
            doc.text(estado, 25, y + 16);

            doc.setTextColor(0, 0, 0);

            y += 40;

            if (y > 250) {
                doc.addPage();
                y = 30;
            }

        });

        const fecha = new Date();

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        doc.text(
            "Fecha de consulta: " +
            fecha.toLocaleDateString() +
            " " +
            fecha.toLocaleTimeString(),
            20,
            285
        );

        doc.save("Resultado_" + nombre + ".pdf");

    };

}