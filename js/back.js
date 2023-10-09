const API_URL = 'https://www.raydelto.org/agenda.php'

async function submitForm() {
  const name = document.getElementById('name').value.trim()
  const lastname = document.getElementById('lastname').value.trim()
  let phone = document.getElementById('phone').value.trim()

  if (!name || !lastname || !phone) {
    alert('Todos los campos son obligatorios')
    return
  }

  const phoneRegex = /^(\d{3})[-]?(\d{3})[-]?(\d{4})$/;

  if (!phone.match(phoneRegex)) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El número de teléfono debe tener el formato 809-555-2222',
    });
    return;
  }

  if (phone.replace(/\D/g, '').length > 10) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El número de teléfono no debe tener más de 10 dígitos',
    });
    return;
  }

  const requestData = {
    nombre: name,
    apellido: lastname,
    telefono: phone,
  }

  try {
    await postData(API_URL, requestData)
    Swal.fire('Usuario agregado!', '', 'success');
  } catch (error) {
    Swal.fire('Hubo un error:'+ error, '', 'error');
  }

  document.getElementById('name').value = ''
  document.getElementById('lastname').value = ''
  document.getElementById('phone').value = ''
  
  await loadData()
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

async function loadData() {
  try {
    const data = await getData(API_URL)
    const table = document.getElementById('tableData')
    table.innerHTML = ''
    data.forEach((item) => {
      table.innerHTML += `<tr>
        <td>${item.nombre}</td>
        <td>${item.apellido}</td>
        <td>${item.telefono}</td>
      </tr>`
    })
  } catch (error) {
    console.error("Error loading data:", error)
  }
}

async function getData(url = '') {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

loadData()