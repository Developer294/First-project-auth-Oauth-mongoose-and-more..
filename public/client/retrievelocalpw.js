let retrievepwForm = document.getElementById('confirm-password-retrieved')
let emailToChangePw = document.getElementById('user-email-to-change-pw')


retrievepwForm.addEventListener('submit', async(event) =>{
  event.preventDefault()
  try{
  
  let newPwRetrieved = document.getElementById('newPwRetrieved').value
  let confirmNewPwRetrieved = document.getElementById('confirmNewPwRetrieved').value

  const response = await fetch('/retrievepw/confirm/send',{
    method: 'PUT',
    headers : {
    'Content-Type' : 'application/json',
    },
    body : JSON.stringify({ 
      email: emailToChangePw.textContent,
      newPassword: newPwRetrieved,
      confirmNewPassword: confirmNewPwRetrieved
    })
  });

  if(!response.ok){
    throw new Error(`Http error on fetch response  : ${response.status}`)
  }
  const data = await response.json();
  
  const updateResponse = document.createElement('p');
  updateResponse.textContent = data.message

  retrievepwForm.textContent = ''
  retrievepwForm.appendChild(updateResponse)
  
}
  catch(error){
    console.error('Error retrieving local pw', error)
  }
});