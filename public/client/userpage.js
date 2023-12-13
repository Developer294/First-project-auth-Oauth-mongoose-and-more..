document.addEventListener('DOMContentLoaded', function() {
  const deleteForm = document.getElementById('form-delete');
  deleteForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const usernameToDelete = document.getElementById('usernameToDelete').value;
    const passwordToDelete = document.getElementById('passwordToDelete').value;

    // Realiza la validación del lado del cliente si es necesario
    const confirmed = confirm('¿Are you sure to eliminate your account?');
    if (confirmed) {
      fetch('/login/userpage/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameToDelete, password: passwordToDelete }),
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        // Manejar el éxito
        const resultParagraph = document.createElement('p');
        resultParagraph.textContent = data.message;

        const resultForm = document.getElementById('form-delete');
        resultForm.innerHTML = '';  // Limpiar contenido existente si es necesario
        resultForm.appendChild(resultParagraph);

        // Opcionalmente, redirigir u realizar otras acciones después de la eliminación exitosa
      })
      .catch(error => {
        // Manejar errores
        console.error('Error durante la eliminación de la cuenta:', error);

        // Mostrar un mensaje de error al usuario en el formulario
        const resultParagraph = document.createElement('p');
        resultParagraph.textContent = `Error: ${error.message}`;

        const resultForm = document.getElementById('form-delete');
        resultForm.innerHTML = '';  // Limpiar contenido existente si es necesario
        resultForm.appendChild(resultParagraph);
      });
    }
  });
});
