var counterVal = 0;

function incrementClick() {
    ++counterVal
}

//nav responsive
document.querySelector(".menu-btn").addEventListener("click", () => {
    document.querySelector(".nav-menu").classList.toggle("show");
});

//botton contacto
document.querySelector(".btnContacto").addEventListener("click", () => {
    document.querySelector(".form").classList.toggle("displey");
});
//boton sacar contacto
document.querySelector(".contenedor").addEventListener("click", () => {
    console.log(counterVal)
    var tipo = (counterVal % 2) ? "Impar" : "Par";
    console.log(tipo)
    document.querySelector(".contenedor").classList.toggle("ver");
    incrementClick
});

document.querySelector("#x-contact").addEventListener("click", () => {
    document.querySelector(".form").classList.toggle("displey");
});


function validaForm() {
    // Campos de texto
    if ($("#email").val() == "") {
        alert("El campo email no puede estar vacío.");
        $("#email").focus(); // Esta función coloca el foco de escritura del usuario en el campo Nombre directamente.
        return false;
    }
    if ($("#asunto").val() == "") {
        alert("El campo asunto no puede estar vacío.");
        $("#asunto").focus();
        return false;
    }
    if ($("#mensaje").val() == "") {
        alert("El campo mensaje no puede estar vacío.");
        $("#mensaje").focus();
        return false;
    }

    return true; // Si todo está correcto
}

$(document).ready(function() { // Esta parte del código se ejecutará automáticamente cuando la página esté lista.
    $("#botonenviar").click(function() { // Con esto establecemos la acción por defecto de nuestro botón de enviar.
        if (validaForm()) { // Primero validará el formulario.
            $.ajax({
                type: "POST",
                url: "/contact",
                data: $("#formdata").serialize(),
                success: function() {
                    document.querySelector(".contenedor").classList.toggle("ver");
                }
            })
        }
    });
});