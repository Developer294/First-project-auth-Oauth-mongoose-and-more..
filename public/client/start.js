document.addEventListener('DOMContentLoaded', function() {
  // Obtener referencias a los elementos del DOM
  var loginForm = document.getElementById('login-form');
  var signupForm = document.getElementById('signup-form');
  var signupLink = document.getElementById('signup-link');
  var backButton = document.getElementById('back-button');
  
  // Agregar un evento de clic al enlace "Don't have an account?"
  signupLink.addEventListener('click', function(event) {
    event.preventDefault();  // Evitar el comportamiento predeterminado del enlace

    // Alternar la visibilidad de los formularios
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    backButton.style.display = 'block';
  });

  // Agregar un evento de clic al botón "Back"
  backButton.addEventListener('click', function(event) {
    event.preventDefault()  // Evitar el comportamiento predeterminado del botón
    
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    backButton.style.display = 'none'
  })
});