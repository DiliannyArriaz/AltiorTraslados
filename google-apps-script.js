// Google Apps Script para recibir datos de reservas y guardarlos en Google Sheets
// Copia este código en el Editor de Google Apps Script

function doGet(e) {
  // Página de confirmación
  return HtmlService.createHtmlOutput(`
    <html>
      <body>
        <h1>Sistema de Reservas Altior Traslados</h1>
        <p>El sistema está funcionando correctamente.</p>
      </body>
    </html>
  `);
}

function doPost(e) {
  try {
    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);
    
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
    
    // Preparar los datos para guardar
    const rowData = [
      new Date(),
      data.codigo_reserva || '',
      data.nombre_cliente || '',
      data.email_cliente || '',
      data.fecha || '',
      data.hora || '',
      data.origen || '',
      data.destino || '',
      data.pasajeros || '',
      data.telefono || '',
      data.equipaje || '',
      data.maletas || '',
      data.origen_completo || '',
      data.destino_completo || ''
    ];
    
    // Guardar los datos en la hoja
    sheet.appendRow(rowData);
    
    // Enviar correo de confirmación al cliente (opcional)
    if (data.email_cliente) {
      MailApp.sendEmail({
        to: data.email_cliente,
        subject: 'Confirmación de Reserva - Altior Traslados',
        htmlBody: `
          <h2>CONFIRMACIÓN DE RESERVA - ALTIOR TRASLADOS</h2>
          <p><strong>DETALLES DE TU RESERVA:</strong></p>
          <ul>
            <li><strong>Código de reserva:</strong> ${data.codigo_reserva || 'N/A'}</li>
            <li><strong>Fecha:</strong> ${data.fecha || 'N/A'} | <strong>Hora:</strong> ${data.hora || 'N/A'}</li>
            <li><strong>Ruta:</strong> ${data.origen || 'N/A'} → ${data.destino || 'N/A'}</li>
            <li><strong>Pasajeros:</strong> ${data.pasajeros || 'N/A'}</li>
            <li><strong>Equipaje:</strong> ${data.maletas || data.equipaje || 'N/A'}</li>
          </ul>
          <p><strong>Importante:</strong> Conserva este código para futuras consultas o modificaciones.</p>
          <p>¡Gracias por elegir Altior Traslados!</p>
          <p><em>Atentamente,<br>Equipo Altior Traslados</em></p>
        `
      });
    }
    
    // Enviar notificación al administrador (opcional)
    MailApp.sendEmail({
      to: 'altior.traslados@gmail.com', // Cambia esto por tu email
      subject: 'Nueva Reserva Recibida - Altior Traslados',
      htmlBody: `
        <h2>NUEVA RESERVA RECIBIDA</h2>
        <ul>
          <li><strong>Código de reserva:</strong> ${data.codigo_reserva || 'N/A'}</li>
          <li><strong>Cliente:</strong> ${data.email_cliente || 'N/A'}</li>
          <li><strong>Fecha:</strong> ${data.fecha || 'N/A'} | <strong>Hora:</strong> ${data.hora || 'N/A'}</li>
          <li><strong>Ruta:</strong> ${data.origen || 'N/A'} → ${data.destino || 'N/A'}</li>
          <li><strong>Pasajeros:</strong> ${data.pasajeros || 'N/A'}</li>
          <li><strong>Teléfono:</strong> ${data.telefono || 'N/A'}</li>
          <li><strong>Equipaje:</strong> ${data.maletas || data.equipaje || 'N/A'}</li>
        </ul>
      `
    });
    
    // Devolver respuesta exitosa
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Reserva guardada exitosamente'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Registrar el error
    console.error('Error al procesar la reserva:', error);
    
    // Devolver respuesta de error
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Error al procesar la reserva',
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}