function iniciarSesion() {

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if (usuario === "admin" && password === "12345") {

        localStorage.setItem("sesionUPA", "activa");

        window.location.href = "admin.html";

    } else {

        document.getElementById("mensaje").textContent = "Usuario o contraseña incorrectos.";

    }

}