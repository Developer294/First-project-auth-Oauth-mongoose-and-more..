  // Auth fetchs
  let loginGitHub = document.getElementById('login-github');  
  let loginGoogle = document.getElementById('login-google');

  // Configura la base URL de Axios (reemplaza con la URL de tu servidor)
  axios.defaults.baseURL = 'http://localhost:3000';
  
  loginGitHub.addEventListener('click', async (event) => {
    event.preventDefault();
  
    try {
      // Realiza la solicitud GET con Axios
      const response = await axios.get('/auth/github', {
        withCredentials: true,  // Para incluir cookies en la solicitud
        maxRedirects: 0  // Evita que Axios siga automáticamente las redirecciones
      });
  
      // Accede a los datos de la respuesta
      const data = response.data;
  
      if (data.token) {
        // Almacena el token donde sea necesario (por ejemplo, localStorage)
        localStorage.setItem('token', data.token);
  
        // Redirige al usuario a la página de usuario
        window.location.href = data.redirectUrl + '?username=' + data.username;
      } else {
        // Maneja el caso de autenticación fallida
        console.error('Autenticación fallida:', data.message);
      }
    } catch (error) {
      // Maneja errores de red, etc.
      console.error('Error en la solicitud:', error);
    }
  });
  

  // Buttons and forms
  let loginForm = document.getElementById('login-form');
  let signupForm = document.getElementById('signup-form');
  let signupLink = document.getElementById('signup-link');
  let backButton = document.getElementById('back-button');
  
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
    backButton.style.display = 'none';
  });
