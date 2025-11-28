// Google Apps Script con manejo correcto de CORS
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
    // Registrar información de depuración
    console.log('Solicitud recibida:', JSON.stringify(e));
    
    // Manejar solicitud OPTIONS (preflight) - necesario para CORS
    if (e.request && e.request.method === 'OPTIONS') {
      console.log('Solicitud OPTIONS recibida (preflight)');
      const response = ContentService.createTextOutput('');
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      response.setHeader('Access-Control-Max-Age', '3600');
      return response;
    }
    
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
    
    // Devolver respuesta con encabezados CORS
    const output = ContentService.createTextOutput(JSON.stringify({
      status: "success", 
      message: "Datos guardados correctamente",
      data: {
        codigo_reserva: data.codigo_reserva,
        email_cliente: data.email_cliente
      }
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    
    // Agregar encabezados CORS
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return output;
      
  } catch (error) {
    console.error('Error en doPost:', error);
    
    // Devolver error con encabezados CORS
    const output = ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    
    // Agregar encabezados CORS
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
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