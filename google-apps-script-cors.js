// Google Apps Script con manejo correcto de diferentes tipos de datos y envío de correos
// Copia este código en el Editor de Google Apps Script

function doGet(e) {
  // Configurar encabezados CORS para solicitudes OPTIONS
  if (e.parameter && e.parameter.action === 'options') {
    const output = ContentService.createTextOutput('');
    output.setMimeType(ContentService.MimeType.TEXT);
    return output;
  }
  
  // Página de confirmación normal
  const output = ContentService.createTextOutput(`
    <html>
      <body>
        <h1>Sistema de Reservas Altior Traslados</h1>
        <p>El sistema está funcionando correctamente.</p>
      </body>
    </html>
  `);
  
  output.setMimeType(ContentService.MimeType.HTML);
  
  return output;
}

function doPost(e) {
  try {
    // Registrar información de depuración
    console.log('Solicitud POST recibida:', JSON.stringify(e));
    
    // Parsear los datos recibidos - manejar ambos formatos
    let data = {};
    
    if (e.postData && e.postData.contents) {
      // Intentar parsear como JSON primero
      try {
        data = JSON.parse(e.postData.contents);
        console.log('Datos recibidos en formato JSON:', JSON.stringify(data));
      } catch (jsonError) {
        // Si no es JSON, puede ser datos de formulario
        console.log('No es JSON, intentando parsear como formulario');
        data = parseFormData(e.postData.contents);
        console.log('Datos recibidos en formato formulario:', JSON.stringify(data));
      }
    } else if (e.parameter) {
      // Para solicitudes con parámetros en la URL
      data = e.parameter;
      console.log('Datos recibidos como parámetros:', JSON.stringify(data));
    } else {
      throw new Error('No se pudieron obtener los datos de la solicitud');
    }
    
    // Registrar todos los datos recibidos para depuración
    console.log('Todos los datos recibidos:', JSON.stringify(data));
    
    // Obtener la hoja de cálculo activa
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Si es la primera vez, crear encabezados
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Fecha/Hora de Registro',
        'Código de Reserva',
        'Nombre del Cliente',
        'Email del Cliente',
        'Fecha del Viaje',
        'Hora del Viaje',
        'Origen',
        'Destino',
        'Pasajeros',
        'Teléfono',
        'Equipaje',
        'Maletas',
        'Origen Completo',
        'Destino Completo'
      ];
      sheet.appendRow(headers);
    }
    
    // Preparar datos para guardar (asegurando que todos los campos estén presentes)
    const rowData = [
      new Date(), // Fecha/Hora de Registro
      data.codigo_reserva || data['codigo_reserva'] || '', // Código de Reserva
      data.name || data['name'] || data.email_cliente || data['email_cliente'] || '', // Nombre del Cliente
      data.email_cliente || data['email_cliente'] || '', // Email del Cliente
      data.fecha || data['fecha'] || '', // Fecha del Viaje
      data.hora || data['hora'] || '', // Hora del Viaje
      data.origen || data['origen'] || '', // Origen
      data.destino || data['destino'] || '', // Destino
      data.pasajeros || data['pasajeros'] || '', // Pasajeros
      data.telefono || data['telefono'] || '', // Teléfono
      data.equipaje || data['equipaje'] || '', // Equipaje
      data.maletas || data['maletas'] || '', // Maletas
      data.origen_completo || data['origen_completo'] || data.origen || data['origen'] || '', // Origen Completo
      data.destino_completo || data['destino_completo'] || data.destino || data['destino'] || '' // Destino Completo
    ];
    
    // Guardar en la hoja de cálculo
    sheet.appendRow(rowData);
    
    console.log('Datos guardados exitosamente:', JSON.stringify(rowData));
    
    // Enviar correos de confirmación
    try {
      sendConfirmationEmails(data);
      console.log('Correos de confirmación enviados exitosamente');
    } catch (emailError) {
      console.error('Error al enviar correos de confirmación:', emailError);
      // No detener el proceso por errores de correo
    }
    
    // Devolver respuesta con encabezados CORS
    const output = ContentService.createTextOutput(JSON.stringify({
      status: "success", 
      message: "Datos guardados correctamente",
      data: {
        codigo_reserva: data.codigo_reserva || data['codigo_reserva'] || '',
        email_cliente: data.email_cliente || data['email_cliente'] || ''
      }
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    
    return output;
      
  } catch (error) {
    console.error('Error en doPost:', error);
    
    // Devolver error con encabezados CORS
    const output = ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    
    return output;
  }
}

// Función para enviar correos de confirmación
function sendConfirmationEmails(data) {
  const clienteEmail = data.email_cliente || data['email_cliente'] || '';
  const codigoReserva = data.codigo_reserva || data['codigo_reserva'] || '';
  
  if (!clienteEmail) {
    console.log('No se puede enviar correo: no se proporcionó email del cliente');
    return;
  }
  
  // Email para el cliente
  const clienteSubject = `Confirmación de Reserva - ${codigoReserva}`;
  const clienteBody = `
Hola,

Gracias por reservar con Altior Traslados. A continuación te confirmamos los detalles de tu reserva:

Código de Reserva: ${codigoReserva}
Fecha del Viaje: ${data.fecha || data['fecha'] || 'No especificada'}
Hora del Viaje: ${data.hora || data['hora'] || 'No especificada'}
Origen: ${data.origen_completo || data['origen_completo'] || data.origen || data['origen'] || 'No especificado'}
Destino: ${data.destino_completo || data['destino_completo'] || data.destino || data['destino'] || 'No especificado'}
Pasajeros: ${data.pasajeros || data['pasajeros'] || 'No especificado'}
Teléfono: ${data.telefono || data['telefono'] || 'No especificado'}
Equipaje: ${data.equipaje || data['equipaje'] || 'No especificado'}
Maletas: ${data.maletas || data['maletas'] || 'No especificado'}

Nuestro equipo se pondrá en contacto contigo para confirmar los últimos detalles de tu traslado.

Si necesitas hacer algún cambio o cancelar tu reserva, puedes responder a este correo o usar el formulario de cancelación en nuestro sitio web.

¡Gracias por confiar en Altior Traslados!

Atentamente,
El equipo de Altior Traslados
  `;
  
  // Email para la empresa (tu email)
  const empresaEmail = "altior.traslados@gmail.com"; // Cambia esto por tu email real
  const empresaSubject = `Nueva Reserva - ${codigoReserva}`;
  const empresaBody = `
Nueva reserva recibida:

Código de Reserva: ${codigoReserva}
Nombre del Cliente: ${data.name || data['name'] || data.email_cliente || data['email_cliente'] || 'No especificado'}
Email del Cliente: ${clienteEmail}
Fecha del Viaje: ${data.fecha || data['fecha'] || 'No especificada'}
Hora del Viaje: ${data.hora || data['hora'] || 'No especificada'}
Origen: ${data.origen_completo || data['origen_completo'] || data.origen || data['origen'] || 'No especificado'}
Destino: ${data.destino_completo || data['destino_completo'] || data.destino || data['destino'] || 'No especificado'}
Pasajeros: ${data.pasajeros || data['pasajeros'] || 'No especificado'}
Teléfono: ${data.telefono || data['telefono'] || 'No especificado'}
Equipaje: ${data.equipaje || data['equipaje'] || 'No especificado'}
Maletas: ${data.maletas || data['maletas'] || 'No especificado'}

Datos guardados en la hoja de cálculo.
  `;
  
  // Enviar email al cliente
  console.log('Enviando email al cliente:', clienteEmail);
  try {
    GmailApp.sendEmail(clienteEmail, clienteSubject, clienteBody);
    console.log('Email enviado al cliente exitosamente');
  } catch (error) {
    console.error('Error al enviar email al cliente:', error);
    throw error;
  }
  
  // Enviar email a la empresa
  console.log('Enviando email a la empresa:', empresaEmail);
  try {
    GmailApp.sendEmail(empresaEmail, empresaSubject, empresaBody);
    console.log('Email enviado a la empresa exitosamente');
  } catch (error) {
    console.error('Error al enviar email a la empresa:', error);
    throw error;
  }
  
  console.log('Correos enviados a:', clienteEmail, 'y', empresaEmail);
}

// Función para parsear datos de formulario
function parseFormData(formDataString) {
  try {
    const data = {};
    const pairs = formDataString.split('&');
    
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      if (pair.length === 2) {
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1].replace(/\+/g, ' '));
        data[key] = value;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error al parsear datos de formulario:', error);
    return {};
  }
}

// Función para probar el script manualmente
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        codigo_reserva: "TEST-12345",
        email_cliente: "test@example.com",
        fecha: "01/12/2023",
        hora: "14:30",
        origen: "Test Origen",
        destino: "Test Destino",
        pasajeros: "2",
        telefono: "1122334455",
        equipaje: "Sí",
        maletas: "3",
        origen_completo: "Dirección completa de origen",
        destino_completo: "Dirección completa de destino"
      })
    }
  };
  
  doPost(testData);
}