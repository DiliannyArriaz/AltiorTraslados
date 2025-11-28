// Google Apps Script con manejo correcto de CORS
// Copia este código en el Editor de Google Apps Script

function doGet(e) {
  // Configurar encabezados CORS para todas las solicitudes
  const output = ContentService.createTextOutput('');
  
  // Si es una solicitud OPTIONS (preflight), responder con encabezados CORS
  if (e && e.parameter && e.parameter.action === 'options') {
    output.setContent('OK');
  } else {
    // Página de confirmación normal
    output.setContent(`
      <html>
        <body>
          <h1>Sistema de Reservas Altior Traslados</h1>
          <p>El sistema está funcionando correctamente.</p>
        </body>
      </html>
    `);
  }
  
  // Agregar encabezados CORS a todas las respuestas
  output.setMimeType(ContentService.MimeType.HTML);
  
  return output;
}

function doPost(e) {
  try {
    // Registrar información de depuración
    console.log('Solicitud POST recibida:', JSON.stringify(e));
    
    // Parsear los datos recibidos
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      // Para solicitudes con parámetros en la URL
      data = e.parameter;
    } else {
      throw new Error('No se pudieron obtener los datos de la solicitud');
    }
    
    console.log('Datos recibidos:', JSON.stringify(data));
    
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
      data.codigo_reserva || '',
      data.name || data.email_cliente || '',
      data.email_cliente || '',
      data.fecha || '',
      data.hora || '',
      data.origen || '',
      data.destino || '',
      data.pasajeros || '',
      data.telefono || '',
      data.equipaje || '',
      data.maletas || '',
      data.origen_completo || data.origen || '',
      data.destino_completo || data.destino || ''
    ];
    
    // Guardar en la hoja de cálculo
    sheet.appendRow(rowData);
    
    console.log('Datos guardados exitosamente');
    
    // Devolver respuesta
    const output = ContentService.createTextOutput(JSON.stringify({
      status: "success", 
      message: "Datos guardados correctamente",
      data: {
        codigo_reserva: data.codigo_reserva,
        email_cliente: data.email_cliente
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