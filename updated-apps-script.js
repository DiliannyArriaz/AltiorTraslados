function doGet(e) {
  try {
    // Configurar encabezados CORS para solicitudes OPTIONS
    if (e && e.parameter && e.parameter.action === 'options') {
      const output = ContentService.createTextOutput('');
      output.setMimeType(ContentService.MimeType.TEXT);
      return output;
    }
  } catch (error) {
    console.error('Error manejando parámetros de OPTIONS:', error);
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
    // Verificar si es una solicitud de cancelación o verificación de estado
    let action = '';
    
    if (e.postData && e.postData.contents) {
      // Intentar parsear como formulario
      const formData = parseFormData(e.postData.contents);
      action = formData.action || '';
    } else if (e.parameter) {
      action = e.parameter.action || '';
    }
    
    // Si es una acción de cancelación, manejarla por separado
    if (action === 'cancel') {
      return handleCancel(e);
    }
    
    // Si es una acción de verificación de estado, manejarla por separado
    if (action === 'check_status') {
      return handleCheckStatus(e);
    }
    
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
    
    // Verificar si ya existen encabezados
    let headers = [];
    if (sheet.getLastRow() > 0) {
      // Obtener la primera fila (encabezados)
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
    
    // Si no hay encabezados o si los encabezados no incluyen "Zona", crear/actualizar encabezados
    if (headers.length === 0 || !headers.includes('Zona')) {
      // Limpiar encabezados existentes si los hay
      if (sheet.getLastRow() > 0) {
        sheet.getRange(1, 1, 1, sheet.getLastColumn()).clear();
      }
      
      // Crear encabezados actualizados
      const newHeaders = [
        'Fecha/Hora de Registro',
        'Código de Reserva',
        'Nombre del Cliente',
        'Email del Cliente',
        'Fecha del Viaje',
        'Hora del Viaje',
        'Zona',
        'Origen',
        'Destino',
        'Pasajeros',
        'Teléfono',
        'Equipaje',
        'Maletas',
        'Origen Completo',
        'Destino Completo'
      ];
      sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    }
    
    // Preparar datos para guardar (asegurando que todos los campos estén presentes)
    // El orden debe coincidir con las columnas de la hoja de cálculo:
    // Fecha/Hora de Registro, Código de Reserva, Nombre del Cliente, Email del Cliente, 
    // Fecha del Viaje, Hora del Viaje, Zona, Origen, Destino, Pasajeros, Teléfono, Equipaje, Maletas, Origen Completo, Destino Completo
    const rowData = [
      new Date(), // Fecha/Hora de Registro
      data.codigo_reserva || data['codigo_reserva'] || '', // Código de Reserva
      data.name || data['name'] || data.email_cliente || data['email_cliente'] || '', // Nombre del Cliente
      data.email_cliente || data['email_cliente'] || '', // Email del Cliente
      data.fecha || data['fecha'] || '', // Fecha del Viaje
      data.hora || data['hora'] || '', // Hora del Viaje
      data.zona || data['zona'] || '', // Zona
      data.origen || data['origen'] || '', // Origen
      data.destino || data['destino'] || '', // Destino
      data.pasajeros || data['pasajeros'] || '', // Pasajeros
      data.telefono || data['telefono'] || '', // Teléfono
      data.equipaje || data['equipaje'] || '', // Equipaje
      data.maletas || data['maletas'] || '', // Maletas
      data.origen_completo || data['origen_completo'] || data.origen || data['origen'] || '', // Origen Completo
      data.destino_completo || data['destino_completo'] || data.destino || data['destino'] || '' // Destino Completo
    ];
    
    // Guardar en la hoja de cálculo (en la siguiente fila disponible)
    sheet.appendRow(rowData);
    
    console.log('Datos guardados exitosamente:', JSON.stringify(rowData));
    
    // Enviar correos de confirmación
    try {
      console.log('Iniciando envío de correos de confirmación');
      sendConfirmationEmails(data);
      console.log('Correos de confirmación enviados exitosamente');
    } catch (emailError) {
      console.error('Error al enviar correos de confirmación:', emailError);
      // No detener el proceso por errores de correo
    }
    
    // Devolver respuesta con encabezados CORS
    const output = ContentService.createTextOutput(JSON.stringify({
      status: "success", 
      message: "Datos guardados y correos enviados correctamente",
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

// Función para manejar la verificación de estado de reservas
function handleCheckStatus(e) {
  try {
    console.log('Solicitud de verificación de estado recibida:', JSON.stringify(e));
    
    // Obtener el código de reserva de los parámetros
    let codigoReserva = '';
    
    if (e.postData && e.postData.contents) {
      // Intentar parsear como formulario
      const formData = parseFormData(e.postData.contents);
      codigoReserva = formData.codigo_reserva || '';
    } else if (e.parameter) {
      codigoReserva = e.parameter.codigo_reserva || '';
    }
    
    console.log('Código de reserva a verificar:', codigoReserva);
    
    if (!codigoReserva) {
      throw new Error('No se proporcionó un código de reserva válido');
    }
    
    // Obtener la hoja de cálculo activa
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Buscar la fila con el código de reserva
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const backgrounds = dataRange.getBackgrounds();
    
    let rowIndex = -1;
    let isCancelled = false;
    
    // Buscar el código de reserva en la columna B (índice 1)
    for (let i = 1; i < values.length; i++) {
      if (values[i][1] === codigoReserva) {
        rowIndex = i + 1; // +1 porque getValues es 0-indexed pero las filas en Sheets son 1-indexed
        // Verificar si la fila está marcada en rojo (reserva cancelada)
        isCancelled = backgrounds[i][1] === '#ff0000' || backgrounds[i][1] === '#ff9999';
        break;
      }
    }
    
    if (rowIndex === -1) {
      console.log('No se encontró ninguna reserva con el código:', codigoReserva);
      
      // Devolver respuesta indicando que la reserva no existe
      const output = ContentService.createTextOutput(JSON.stringify({
        status: "not_found", 
        message: "No se encontró ninguna reserva con ese código",
        codigo_reserva: codigoReserva
      }));
      output.setMimeType(ContentService.MimeType.JSON);
      
      return output;
    }
    
    console.log('Reserva encontrada en la fila:', rowIndex);
    console.log('Estado de cancelación:', isCancelled);
    
    // Determinar el estado de la reserva
    let status, message;
    if (isCancelled) {
      status = "cancelled";
      message = "La reserva ya ha sido cancelada anteriormente";
    } else {
      status = "active";
      message = "La reserva está activa y puede ser cancelada";
    }
    
    // Devolver respuesta con el estado
    const output = ContentService.createTextOutput(JSON.stringify({
      status: status, 
      message: message,
      codigo_reserva: codigoReserva
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    
    return output;
      
  } catch (error) {
    console.error('Error en handleCheckStatus:', error);
    
    // Devolver error
    const output = ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    
    return output;
  }
}

// Función para manejar la cancelación de reservas
function handleCancel(e) {
  try {
    console.log('Solicitud de cancelación recibida:', JSON.stringify(e));
    
    // Obtener el código de reserva de los parámetros
    let codigoReserva = '';
    
    if (e.postData && e.postData.contents) {
      // Intentar parsear como formulario
      const formData = parseFormData(e.postData.contents);
      codigoReserva = formData.codigo_reserva || '';
    } else if (e.parameter) {
      codigoReserva = e.parameter.codigo_reserva || '';
    }
    
    console.log('Código de reserva a cancelar:', codigoReserva);
    
    if (!codigoReserva) {
      throw new Error('No se proporcionó un código de reserva válido');
    }
    
    // Obtener la hoja de cálculo activa
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Buscar la fila con el código de reserva
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const backgrounds = dataRange.getBackgrounds();
    
    let rowIndex = -1;
    
    // Buscar el código de reserva en la columna B (índice 1)
    for (let i = 1; i < values.length; i++) {
      if (values[i][1] === codigoReserva) {
        rowIndex = i + 1; // +1 porque getValues es 0-indexed pero las filas en Sheets son 1-indexed
        break;
      }
    }
    
    if (rowIndex === -1) {
      console.log('No se encontró ninguna reserva con el código:', codigoReserva);
      throw new Error('No se encontró ninguna reserva con ese código');
    }
    
    console.log('Reserva encontrada en la fila:', rowIndex);
    
    // Verificar si la reserva ya está cancelada
    const isCancelled = backgrounds[rowIndex - 1][1] === '#ff0000' || backgrounds[rowIndex - 1][1] === '#ff9999';
    
    if (isCancelled) {
      console.log('La reserva ya está cancelada');
      
      // Devolver respuesta indicando que la reserva ya está cancelada
      const output = ContentService.createTextOutput(JSON.stringify({
        status: "already_cancelled", 
        message: "La reserva ya ha sido cancelada anteriormente",
        codigo_reserva: codigoReserva
      }));
      output.setMimeType(ContentService.MimeType.JSON);
      
      return output;
    }
    
    // Marcar la fila en rojo
    const rowRange = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn());
    rowRange.setBackground('#ff0000'); // Rojo
    
    console.log('Fila marcada en rojo exitosamente');
    
    // Enviar correo de confirmación de cancelación
    try {
      sendCancellationEmail(values[rowIndex - 1]); // Pasar los datos de la fila
      console.log('Correo de cancelación enviado exitosamente');
    } catch (emailError) {
      console.error('Error al enviar correo de cancelación:', emailError);
      // No detener el proceso por errores de correo
    }
    
    // Devolver respuesta exitosa
    const output = ContentService.createTextOutput(JSON.stringify({
      status: "success", 
      message: "Reserva cancelada exitosamente",
      codigo_reserva: codigoReserva
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    
    return output;
      
  } catch (error) {
    console.error('Error en handleCancel:', error);
    
    // Devolver error
    const output = ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    
    return output;
  }
}

// Función auxiliar para parsear datos de formulario
function parseFormData(formDataString) {
  const data = {};
  const pairs = formDataString.split('&');
  
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    const key = decodeURIComponent(pair[0]);
    const value = decodeURIComponent(pair[1] || '');
    data[key] = value;
  }
  
  return data;
}

// Función para enviar correos de confirmación
function sendConfirmationEmails(data) {
  const clienteEmail = data.email_cliente || data['email_cliente'] || '';
  const codigoReserva = data.codigo_reserva || data['codigo_reserva'] || '';
  
  console.log('Preparando envío de correos para:', clienteEmail, 'con código:', codigoReserva);
  
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
Zona: ${data.zona || data['zona'] || 'No especificada'}
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
  const empresaEmail = "diliannyalbornoz@gmail.com"; // Cambia esto por tu email real
  const empresaSubject = `Nueva Reserva - ${codigoReserva}`;
  const empresaBody = `
Nueva reserva recibida:

Código de Reserva: ${codigoReserva}
Nombre del Cliente: ${data.name || data['name'] || data.email_cliente || data['email_cliente'] || 'No especificado'}
Email del Cliente: ${clienteEmail}
Fecha del Viaje: ${data.fecha || data['fecha'] || 'No especificada'}
Hora del Viaje: ${data.hora || data['hora'] || 'No especificada'}
Zona: ${data.zona || data['zona'] || 'No especificada'}
Origen: ${data.origen_completo || data['origen_completo'] || data.origen || data['origen'] || 'No especificado'}
Destino: ${data.destino_completo || data['destino_completo'] || data.destino || data['destino'] || 'No especificado'}
Pasajeros: ${data.pasajeros || data['pasajeros'] || 'No especificado'}
Teléfono: ${data.telefono || data['telefono'] || 'No especificado'}
Equipaje: ${data.equipaje || data['equipaje'] || 'No especificado'}
Maletas: ${data.maletas || data['maletas'] || 'No especificado'}
  `;
  
  // Enviar emails
  GmailApp.sendEmail(clienteEmail, clienteSubject, clienteBody);
  GmailApp.sendEmail(empresaEmail, empresaSubject, empresaBody);
  
  console.log('Correos enviados exitosamente');
}

// Función para enviar correo de confirmación de cancelación
function sendCancellationEmail(reservationData) {
  // Los índices corresponden a las columnas en el Google Sheet:
  // 0: Fecha/Hora de Registro
  // 1: Código de Reserva
  // 2: Nombre del Cliente
  // 3: Email del Cliente
  // 4: Fecha del Viaje
  // 5: Hora del Viaje
  // 6: Zona
  // 7: Origen
  // 8: Destino
  // 9: Pasajeros
  // 10: Teléfono
  // 11: Equipaje
  // 12: Maletas
  // 13: Origen Completo
  // 14: Destino Completo
  
  const clienteEmail = reservationData[3]; // Email del Cliente
  const codigoReserva = reservationData[1]; // Código de Reserva
  const clienteName = reservationData[2]; // Nombre del Cliente
  
  if (!clienteEmail) {
    console.log('No se puede enviar correo: no se proporcionó email del cliente');
    return;
  }
  
  // Email para el cliente
  const clienteSubject = `Confirmación de Cancelación - ${codigoReserva}`;
  const clienteBody = `
Hola ${clienteName},

Te confirmamos que tu reserva con código ${codigoReserva} ha sido cancelada exitosamente.

Detalles de la reserva cancelada:
Código de Reserva: ${codigoReserva}
Fecha del Viaje: ${reservationData[4] || 'No especificada'}
Hora del Viaje: ${reservationData[5] || 'No especificada'}
Zona: ${reservationData[6] || 'No especificada'}
Origen: ${reservationData[13] || reservationData[7] || 'No especificado'}
Destino: ${reservationData[14] || reservationData[8] || 'No especificado'}
Pasajeros: ${reservationData[9] || 'No especificado'}

Si tienes alguna pregunta sobre la cancelación o necesitas hacer una nueva reserva, no dudes en contactarnos.

Atentamente,
El equipo de Altior Traslados
  `;
  
  // Enviar email al cliente
  GmailApp.sendEmail(clienteEmail, clienteSubject, clienteBody);
  
  console.log('Correo de cancelación enviado a:', clienteEmail);
}