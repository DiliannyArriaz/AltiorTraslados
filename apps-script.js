
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
