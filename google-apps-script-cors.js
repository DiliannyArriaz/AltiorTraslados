// Google Apps Script con manejo correcto de diferentes tipos de datos y envío de correos
// Copia este código en el Editor de Google Apps Script

function doGet(e) {
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
    
    // Preparar datos para guardar
    const rowData = [
      new Date(),
      data.codigo_reserva || data['codigo_reserva'] || '',
      data.name || data['name'] || data.email_cliente || data['email_cliente'] || '',
      data.email_cliente || data['email_cliente'] || '',
      data.fecha || data['fecha'] || '',
      data.hora || data['hora'] || '',
      data.origen || data['origen'] || '',
      data.destino || data['destino'] || '',
      data.pasajeros || data['pasajeros'] || '',
      data.telefono || data['telefono'] || '',
      data.equipaje || data['equipaje'] || '',
      data.maletas || data['maletas'] || '',
      data.origen_completo || data['origen_completo'] || data.origen || data['origen'] || '',
      data.destino_completo || data['destino_completo'] || data.destino || data['destino'] || ''
    ];
    
    // Guardar en la hoja de cálculo
    sheet.appendRow(rowData);
    
    console.log('Datos guardados exitosamente');
    
    // Enviar correos de confirmación
    try {
      sendConfirmationEmails(data);
      console.log('Correos de confirmación enviados exitosamente');
    } catch (emailError) {
      console.error('Error al enviar correos de confirmación:', emailError);
    }
    
    // Devolver respuesta
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
    
    // Devolver error
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
Fecha del Viaje: ${data.fecha || data['fecha'] || ''}
Hora del Viaje: ${data.hora || data['hora'] || ''}
Origen: ${data.origen_completo || data['origen_completo'] || data.origen || data['origen'] || ''}
Destino: ${data.destino_completo || data['destino_completo'] || data.destino || data['destino'] || ''}
Pasajeros: ${data.pasajeros || data['pasajeros'] || ''}
Teléfono: ${data.telefono || data['telefono'] || ''}
Equipaje: ${data.equipaje || data['equipaje'] || ''}
Maletas: ${data.maletas || data['maletas'] || ''}

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
Nombre del Cliente: ${data.name || data['name'] || data.email_cliente || data['email_cliente'] || ''}
Email del Cliente: ${clienteEmail}
Fecha del Viaje: ${data.fecha || data['fecha'] || ''}
Hora del Viaje: ${data.hora || data['hora'] || ''}
Origen: ${data.origen_completo || data['origen_completo'] || data.origen || data['origen'] || ''}
Destino: ${data.destino_completo || data['destino_completo'] || data.destino || data['destino'] || ''}
Pasajeros: ${data.pasajeros || data['pasajeros'] || ''}
Teléfono: ${data.telefono || data['telefono'] || ''}
Equipaje: ${data.equipaje || data['equipaje'] || ''}
Maletas: ${data.maletas || data['maletas'] || ''}

Datos guardados en la hoja de cálculo.
  `;
  
  // Enviar email al cliente
  GmailApp.sendEmail(clienteEmail, clienteSubject, clienteBody);
  
  // Enviar email a la empresa
  GmailApp.sendEmail(empresaEmail, empresaSubject, empresaBody);
  
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