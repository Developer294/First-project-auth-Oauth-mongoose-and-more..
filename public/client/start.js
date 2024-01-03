document.addEventListener('DOMContentLoaded', function() {
  // Obtener referencias a los elementos del DOM
  let loginForm = document.getElementById('login-form');
  let signupForm = document.getElementById('signup-form');
  let signupLink = document.getElementById('signup-link');
  let backButton = document.getElementById('back-button');
  let retrievePw = document.getElementById('retrieve-pw');
  let retrievePwForm = document.getElementById('retrieve-pw-form')

  retrievePw.addEventListener('click', (event) =>{
    event.preventDefault()

    retrievePwForm.style.display = 'block';

  })
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