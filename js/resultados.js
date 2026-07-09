async function consultar() {

    let nombre = document.getElementById("nombre").value.trim().toUpperCase();

    let resultado = document.getElementById("resultado");

    resultado.innerHTML = "Consultando...";

    try {

        const respuesta = await fetch("data/resultados.csv");
        const texto = await respuesta.text();

        const filas = texto.split("\n");

        let encontrado = false;

        for (let i = 1; i < filas.length; i++) {

            let columnas = filas[i].split(",");

            if (columnas.length < 2) continue;

            let nombreCSV = columnas[0].trim().toUpperCase();
            let nota = parseFloat(columnas[1]);

            if (nombre == nombreCSV) {

                encontrado = true;

                let estado = "";
                let clase = "";

                if (nota >= 3.5) {

                    estado = "✅ APROBADO";
                    clase = "aprobado";

                } else {

                    estado = "❌ NO APROBADO";
                    clase = "no-aprobado";

                }

                resultado.innerHTML = `

                <div class="tarjeta-resultado ${clase}">

                    <h3>PORTAL UPA</h3>

                    <p>Institución Técnica Unidos por Antioquia</p>

                    <hr>

                    <p><strong>👤 Estudiante</strong></p>

                    <h2>${columnas[0]}</h2>

                    <hr>

                    <p><strong>📊 Calificación Final</strong></p>

                    <h2>${nota}</h2>

                    <hr>

                    <div class="estado">

                        ${estado}

                    </div>

                </div>

                `;

                break;

            }

        }

        if (!encontrado) {

            resultado.innerHTML = `

            <div class="tarjeta-resultado no-aprobado">

                <h3>Resultado no encontrado</h3>

                <p>No existe información para el nombre ingresado.</p>

            </div>

            `;

        }

    } catch (error) {

        resultado.innerHTML = `

        <div class="tarjeta-resultado no-aprobado">

            <h3>Error</h3>

            <p>No fue posible leer el archivo de resultados.</p>

        </div>

        `;

    }

}