// Script de diagnóstico para verificar el funcionamiento de GmailApp
// Copia este código en el Editor de Google Apps Script para probar

function testGmailApp() {
  try {
    console.log('Iniciando prueba de GmailApp...');
    
    // Verificar si GmailApp está disponible
    if (typeof GmailApp === 'undefined') {
      console.error('GmailApp no está disponible');
      return;
    }
    
    console.log('GmailApp está disponible');
    
    // Intentar obtener información del usuario
    const userInfo = Session.getEffectiveUser();
    console.log('Usuario efectivo:', userInfo.getEmail());
    
    // Intentar enviar un correo de prueba
    const emailAddress = "altior.traslados@gmail.com"; // Cambia esto por tu email real
    const subject = "Prueba de diagnóstico de GmailApp";
    const body = "Este es un correo de prueba para verificar que GmailApp está funcionando correctamente.";
    
    console.log('Intentando enviar correo de prueba a:', emailAddress);
    
    GmailApp.sendEmail(emailAddress, subject, body);
    
    console.log('Correo de prueba enviado exitosamente');
    
    // También probar enviando a una dirección diferente para verificar
    // que no hay restricciones de dominio
    console.log('Prueba completada exitosamente');
    
  } catch (error) {
    console.error('Error en la prueba de GmailApp:');
    console.error('Nombre del error:', error.name);
    console.error('Mensaje del error:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Información adicional sobre el error
    for (let prop in error) {
      console.error(prop + ':', error[prop]);
    }
  }
}

function testGmailAppWithDifferentRecipient() {
  try {
    console.log('Iniciando prueba de GmailApp con destinatario diferente...');
    
    // Intentar enviar un correo de prueba a una dirección diferente
    const emailAddress = "diliannyalbornoz@gmail.com"; // Tu email
    const subject = "Prueba de diagnóstico de GmailApp (destinatario diferente)";
    const body = "Este es un correo de prueba para verificar que GmailApp puede enviar a diferentes destinatarios.";
    
    console.log('Intentando enviar correo de prueba a:', emailAddress);
    
    GmailApp.sendEmail(emailAddress, subject, body);
    
    console.log('Correo de prueba enviado exitosamente a destinatario diferente');
    
  } catch (error) {
    console.error('Error en la prueba de GmailApp con destinatario diferente:');
    console.error('Nombre del error:', error.name);
    console.error('Mensaje del error:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Información adicional sobre el error
    for (let prop in error) {
      console.error(prop + ':', error[prop]);
    }
  }
}

// Función para verificar los límites de cuota
function checkQuotas() {
  try {
    console.log('Verificando límites de cuota...');
    
    const triggers = ScriptApp.getProjectTriggers();
    console.log('Número de triggers:', triggers.length);
    
    // Verificar límites de ejecución
    console.log('Tiempo de ejecución restante:', ScriptApp.getRemainingExecutionTime());
    
  } catch (error) {
    console.error('Error al verificar cuotas:', error);
  }
}