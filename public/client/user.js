document.addEventListener('DOMContentLoaded', function(){
const chatBox = document.getElementById('chat-messages');
const chatUser = document.getElementById('username-span').innerText
const socket = io();

const newChatUser = document.createElement('p');
newChatUser.textContent = `${chatUser} se ha unido al chat...`;
setTimeout(() => {
  chatBox.appendChild(newChatUser);
}, 500);

socket.on('chat message', (message) => {
const chatMessage = document.createElement('p');
chatMessage.textContent = `${chatUser}: ${message}`

chatBox.appendChild(chatMessage);
console.log('Mensaje del servidor:', message);
});
// Input and send-button of chat-application
const inputMessage = document.getElementById('input-message');
const sendChatButton = document.getElementById('send-chat-button');
// Handling the "click" event of the Send button
sendChatButton.addEventListener('click', function() {
  const message = inputMessage.value.trim();
  if (message !== '') {
    // Emit the messsage if the input is not empty
    socket.emit('chat message', message);
  // Limpiar el campo de entrada después de enviar el mensaje
    inputMessage.value = '';
  }
});
// Delete account and change password management
const changePasswordButton = document.getElementById('change-password');
const changePasswordForm = document.getElementById('change-password-form');
const deleteFormAccount = document.getElementById('form-delete-account');
const backButton = document.getElementById('back-user');

changePasswordButton.addEventListener('click', function(event) {
  event.preventDefault();
  changePasswordForm.style.display = 'block';
  deleteFormAccount.style.display = 'none';
  backButton.style.display = 'block';
  changePasswordButton.style.display = 'none';
});

backButton.addEventListener('click', (event) =>{
  event.preventDefault();
  changePasswordForm.style.display ='none';
  deleteFormAccount.style.display = 'block';
  backButton.style.display = 'none';
  changePasswordButton.style.display = 'block';
});

changePasswordForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const emailToChangePw = document.getElementById('emailToChangePw').value;
  const passwordToChange = document.getElementById('passwordToChange').value;
  const newPasswordChanged = document.getElementById('newPasswordChanged').value;

  try {
    const response = await fetch('/login/userpage/updatepw', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailToChangePw,
        oldPassword: passwordToChange,
        newPassword: newPasswordChanged,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    };
    const data = await response.json();
    
    const clientResponse = document.createElement('p');
    clientResponse.textContent = data.message

    changePasswordForm.innerHTML = '';
    changePasswordForm.appendChild(clientResponse);

  } catch (error) {
    console.error('Error on the fetch', error);
  };
});

deleteFormAccount.addEventListener('submit', async(event) => {
  event.preventDefault();
  const usernameToDelete = document.getElementById('usernameToDelete').value;
  const passwordToDelete = document.getElementById('passwordToDelete').value;
  // Checking on the client side
  const confirmed = confirm('¿Are you sure to eliminate your account?');
  if (confirmed) {
    try {
      const response = await fetch('/login/userpage/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameToDelete, password: passwordToDelete }),
      });

      const data = await response.json();
      console.log('data received', data);

      // Manejar el éxito
      const resultParagraph = document.createElement('p');
      resultParagraph.textContent = data.message;

      const resultForm = document.getElementById('form-delete-account');
      resultForm.innerHTML = '';  // Limpiar contenido existente si es necesario
      resultForm.appendChild(resultParagraph);

      // Opcionalmente, redirigir u realizar otras acciones después de la eliminación exitosa
    } catch (error) {
      // Manejar errores
      console.error('Error deleting account', error);
      // Mostrar un mensaje de error al usuario en el formulario
      const resultParagraph = document.createElement('p');
      resultParagraph.textContent = `Error: ${error.message}`;

      const resultForm = document.getElementById('form-delete-account');
      resultForm.innerHTML = '';  // Limpiar contenido existente si es necesario
      resultForm.appendChild(resultParagraph);
    }
  }
});
})