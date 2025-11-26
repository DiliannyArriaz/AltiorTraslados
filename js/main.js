// Configuración de Airtable (debería ser reemplazada con credenciales reales)
// PARA CONFIGURAR AIRTABLE:
// 1. Reemplaza "YOUR_AIRTABLE_API_KEY" con tu API Key real de Airtable
// 2. Reemplaza "YOUR_BASE_ID" con el ID real de tu base de datos
// 3. Asegúrate de que el nombre de la tabla sea "Reservas"
const AIRTABLE_CONFIG = {
    apiKey: "YOUR_AIRTABLE_API_KEY",
    baseId: "YOUR_BASE_ID",
    tableName: "Reservas"
};

// Verificar si Airtable está configurado
const isAirtableConfigured = AIRTABLE_CONFIG.apiKey !== "YOUR_AIRTABLE_API_KEY" && 
                             AIRTABLE_CONFIG.baseId !== "YOUR_BASE_ID";

// Configuración de reservas (usando backend en Render.com)
const RESERVAS_CONFIG = {
    apiUrl: "https://altiortraslados.onrender.com/api"
};

// Configuración de Tally.so para envío de correos
const TALLY_CONFIG = {
    formId: "tally-form-id", // Reemplazar con tu ID de formulario de Tally.so
    baseUrl: "https://tally.so/forms/"
};

// Verificar si el sistema de reservas está configurado
const isReservasConfigured = true;

// Lugares comunes predefinidos (aeropuertos, estaciones, etc.)
const lugaresComunes = [
    {
        nombre: "Aeropuerto Ezeiza",
        direccion: "Ministro Pistarini International Airport, Marinos del Fournier, Barrio Villa Guillermina, Ezeiza, Partido de Ezeiza, Buenos Aires, 1804, Argentina"
    },
    {
        nombre: "Aeropuerto Aeroparque",
        direccion: "Aeropuerto Internacional Jorge Newbery, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina"
    },
    {
        nombre: "Aeropuerto El Palomar",
        direccion: "Aeropuerto El Palomar, Partido de Morón, Buenos Aires, Argentina"
    },
    {
        nombre: "Estación Retiro",
        direccion: "Estación Retiro, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina"
    },
    {
        nombre: "Estación Constitución",
        direccion: "Estación Constitución, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina"
    },
    {
        nombre: "Estación Once",
        direccion: "Estación Once, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina"
    },
    {
        nombre: "Puerto Madero",
        direccion: "Puerto Madero, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina"
    },
    {
        nombre: "Centro Cívico",
        direccion: "Centro Cívico, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina"
    },
    {
        nombre: "Palermo",
        direccion: "Palermo, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina"
    },
    {
        nombre: "Recoleta",
        direccion: "Recoleta, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina"
    },
    {
        nombre: "San Telmo",
        direccion: "San Telmo, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina"
    },
    {
        nombre: "La Boca",
        direccion: "La Boca, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina"
    },
    {
        nombre: "Microcentro",
        direccion: "Microcentro, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina"
    }
];

// Partidos y localidades permitidos (área metropolitana de Buenos Aires)
const partidosPermitidos = [
    "buenos aires", "ciudad autónoma de buenos aires", "caba",
    "quilmes", "bernal", "wilde", "lanús", "lomas de zamora", 
    "adrogué", "monte grande", "ezeiza", "san justo", "ramos mejía",
    "morón", "caseros", "hurlingham", "san martín", "villa ballester",
    "olivos", "martínez", "san isidro", "vicente lópez"
];

// Sistema de autocompletado desactivado temporalmente
// Se utiliza el sistema implementado en precios.js
function initOSMAutocomplete() {
    // No hacer nada - el sistema de autocompletado se maneja en precios.js
    console.log('Sistema de autocompletado antiguo desactivado');
}

// Enviar datos por correo electrónico usando Formspree
async function sendEmail(datos) {
    try {
        // Enviar datos usando fetch para evitar redirección
        await fetch('https://formspree.io/f/mgvrzkbd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error enviando email:', error);
    }
}

// Enviar notificación de reserva a ambos destinatarios
async function sendReservationEmails(datos) {
    try {
        // Datos para el correo a la empresa
        const empresaData = {
            ...datos,
            subject: 'Nueva Reserva - Altior Traslados',
            _cc: datos.email_cliente, // Copia al cliente
            mensaje_empresa: `Nueva reserva recibida:

Código: ${datos.codigo_reserva}
Fecha: ${datos.fecha} | Hora: ${datos.hora}
Origen: ${datos.origen}
Destino: ${datos.destino}
Pasajeros: ${datos.pasajeros} | Equipaje: ${datos.maletas}
Contacto: ${datos.telefono} | ${datos.email_cliente}`
        };
        
        // Datos para el correo al cliente
        const clienteData = {
            ...datos,
            subject: 'Confirmación de Reserva - Altior Traslados',
            _replyto: 'altior.traslados@gmail.com',
            mensaje_cliente: `¡Gracias por tu reserva con Altior Traslados!

DETALLES DE TU RESERVA:
• Código: ${datos.codigo_reserva}
• Fecha: ${datos.fecha} | Hora: ${datos.hora}
• Ruta: ${datos.origen} → ${datos.destino}
• Pasajeros: ${datos.pasajeros} | Equipaje: ${datos.maletas}

CANCELACIÓN:
Para cancelar, responde "CANCELAR ${datos.codigo_reserva}" o usa el formulario web.

¡Esperamos verte pronto!
Equipo Altior Traslados`
        };
        
        // Enviar correo a la empresa (con copia al cliente) usando fetch
        await fetch('https://formspree.io/f/mgvrzkbd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empresaData)
        });
        
        // Enviar correo al cliente usando fetch
        await fetch('https://formspree.io/f/mgvrzkbd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteData)
        });
        
    } catch (error) {
        console.error('Error enviando emails:', error);
    }
}

// Función para enviar correo de confirmación usando Tally.so
async function sendConfirmationEmail(datosReserva) {
    try {
        // Datos para el correo de confirmación
        const emailData = {
            email: datosReserva.email_cliente,
            subject: 'Confirmación de Reserva - Altior Traslados',
            message: `CONFIRMACIÓN DE RESERVA - ALTIOR TRASLADOS

DETALLES DE TU RESERVA:
• Código de reserva: ${datosReserva.codigo_reserva}
• Fecha: ${datosReserva.fecha} | Hora: ${datosReserva.hora}
• Ruta: ${datosReserva.origen} → ${datosReserva.destino}
• Vehículo: ${datosReserva.tipo_vehiculo}
• Maletas: ${datosReserva.cantidad_maletas}

Importante: Conserva este código para futuras consultas o modificaciones.

¡Gracias por elegir Altior Traslados!
Atentamente,
Equipo Altior Traslados`,
            codigo_reserva: datosReserva.codigo_reserva,
            fecha: datosReserva.fecha,
            hora: datosReserva.hora,
            origen: datosReserva.origen,
            destino: datosReserva.destino,
            tipo_vehiculo: datosReserva.tipo_vehiculo,
            cantidad_maletas: datosReserva.cantidad_maletas
        };

        // Enviar correo usando Tally.so
        const response = await fetch(`${TALLY_CONFIG.baseUrl}${TALLY_CONFIG.formId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            throw new Error(`Error al enviar correo: ${response.status}`);
        }

        console.log('Correo de confirmación enviado exitosamente');
        return true;
    } catch (error) {
        console.error('Error enviando email de confirmación:', error);
        return false;
    }
}

// Enviar notificación de cancelación por correo
async function sendCancellationEmail(datos) {
    try {
        // En una implementación real, estos datos vendrían de una base de datos
        // Por ahora, usamos datos de ejemplo
        const datosReales = {
            ...datos,
            fecha: datos.fecha || '15 de noviembre de 2024',
            hora: datos.hora || '14:30',
            origen: datos.origen || 'Aeropuerto Ezeiza',
            destino: datos.destino || 'Palermo'
        };
        
        // Datos para el correo al cliente
        const clienteData = {
            ...datosReales,
            subject: 'Confirmación de Cancelación de Reserva - Altior Traslados',
            _replyto: 'altior.traslados@gmail.com',
            _cc: 'altior.traslados@gmail.com', // Copia a la empresa
            mensaje_cliente: `CONFIRMACIÓN DE CANCELACIÓN - ALTIOR TRASLADOS

Tu reserva ${datosReales.codigo_reserva} ha sido cancelada exitosamente.

DETALLES DE LA RESERVA CANCELADA:
• Fecha: ${datosReales.fecha} | Hora: ${datosReales.hora}
• Ruta: ${datosReales.origen} → ${datosReales.destino}

Si tienes alguna pregunta, no dudes en contactarnos.

Atentamente,
Equipo Altior Traslados`
        };
        
        // Enviar correo al cliente usando fetch
        await fetch('https://formspree.io/f/mgvrzkbd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteData)
        });
        
    } catch (error) {
        console.error('Error enviando email de cancelación:', error);
    }
}

// Función para enviar correo de cancelación usando Tally.so
async function sendCancellationEmail(datosReserva) {
    try {
        // Datos para el correo de cancelación
        const emailData = {
            email: datosReserva.email_cliente,
            subject: 'Confirmación de Cancelación de Reserva - Altior Traslados',
            message: `CONFIRMACIÓN DE CANCELACIÓN - ALTIOR TRASLADOS

Tu reserva ${datosReserva.codigo_reserva} ha sido cancelada exitosamente.

DETALLES DE LA RESERVA CANCELADA:
• Fecha: ${datosReserva.fecha} | Hora: ${datosReserva.hora}
• Ruta: ${datosReserva.origen} → ${datosReserva.destino}

Si tienes alguna pregunta, no dudes en contactarnos.

Atentamente,
Equipo Altior Traslados`,
            codigo_reserva: datosReserva.codigo_reserva,
            fecha: datosReserva.fecha,
            hora: datosReserva.hora,
            origen: datosReserva.origen,
            destino: datosReserva.destino
        };

        // Enviar correo usando Tally.so
        const response = await fetch(`${TALLY_CONFIG.baseUrl}${TALLY_CONFIG.formId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            throw new Error(`Error al enviar correo: ${response.status}`);
        }

        console.log('Correo de cancelación enviado exitosamente');
        return true;
    } catch (error) {
        console.error('Error enviando email de cancelación:', error);
        return false;
    }
}

// Generar código de reserva único
function generateReservationCode() {
    return 'ALT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Set minimum date to today
const fechaInput = document.getElementById('fecha');
const today = new Date().toISOString().split('T')[0];
fechaInput.min = today;

// Toggle luggage section
const equipajeCheckbox = document.getElementById('equipaje');
const luggageDetails = document.getElementById('luggageDetails');

// Handle form submission
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const origenInput = document.getElementById('origen');
    const destinoInput = document.getElementById('destino');
    const emailCliente = document.getElementById('email').value;
    
    // Usar la dirección completa si es un lugar común
    const origen = origenInput.getAttribute('data-full-address') || origenInput.value;
    const destino = destinoInput.getAttribute('data-full-address') || destinoInput.value;
    
    const pasajeros = document.getElementById('pasajeros').value;
    const telefono = document.getElementById('telefono').value;
    const tieneEquipaje = document.getElementById('equipaje').checked;
    const maletas = tieneEquipaje ? document.getElementById('maletas').value : 'Sin equipaje';

    // Generar código de reserva único
    const codigoReserva = generateReservationCode();

    // Datos para el correo electrónico
    const datosEmail = {
        fecha: formatDate(fecha),
        hora: hora,
        origen: origenInput.value,
        destino: destinoInput.value,
        pasajeros: pasajeros,
        telefono: telefono,
        email_cliente: emailCliente,
        equipaje: tieneEquipaje ? 'Sí' : 'No',
        maletas: maletas,
        origen_completo: origen,
        destino_completo: destino,
        codigo_reserva: codigoReserva
    };

    let mensaje = `*NUEVA RESERVA - TRASLADO AEROPUERTO*\n\n`;
    mensaje += `📅 *Fecha:* ${formatDate(fecha)}\n`;
    mensaje += `🕐 *Hora:* ${hora}\n`;
    mensaje += `📍 *Origen:* ${origenInput.value}\n`;
    mensaje += `🎯 *Destino:* ${destinoInput.value}\n`;
    mensaje += `👥 *Pasajeros:* ${pasajeros}\n`;
    mensaje += `🧳 *Equipaje:* ${maletas}\n`;
    mensaje += `📱 *Contacto:* ${telefono}\n`;
    mensaje += `✉️ *Email:* ${emailCliente}\n`;
    mensaje += `🎫 *Código de Reserva:* ${codigoReserva}\n\n`;
    mensaje += `_Solicitud enviada desde la web_`;

    // Número de WhatsApp de prueba
    const numeroWhatsApp = '5491122516700';
    
    const mensajeCodificado = encodeURIComponent(mensaje);
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    
    // Enviar correos electrónicos a ambos destinatarios
    sendReservationEmails(datosEmail);
    
    // Guardar la reserva en la nube o en localStorage como respaldo
    await saveReservation(datosEmail);
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(linkWhatsApp, '_blank');
    
    // Mostrar popup de confirmación de reserva
    showReservationPopup(codigoReserva, emailCliente);
    
    // Guardar en localStorage para mostrar el mensaje al regresar
    localStorage.setItem('reservationCompleted', 'true');
    localStorage.setItem('reservationCode', codigoReserva);
    localStorage.setItem('clientEmail', emailCliente);
});

// Handle cancellation form submission
const cancelForm = document.getElementById('cancelForm');
if (cancelForm) {
    cancelForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const codigoReserva = document.getElementById('codigoReserva').value.trim();
        
        if (!codigoReserva) {
            alert('Por favor, ingrese su código de reserva.');
            return;
        }
        
        // Verificar si el código de reserva existe
        const reserva = await getReservationByCode(codigoReserva);
        
        if (!reserva) {
            alert('Código de reserva inválido. Por favor, verifique e intente nuevamente.');
            return;
        }
        
        // Enviar correo de confirmación de cancelación a ambos destinatarios
        sendCancellationEmail(reserva);
        
        // Eliminar la reserva de la nube o de localStorage
        await removeReservation(codigoReserva);
        
        // Mostrar popup de confirmación de cancelación
        showCancellationPopup();
        
        // Guardar en localStorage para mostrar el mensaje al regresar
        localStorage.setItem('cancellationCompleted', 'true');
        
        // Limpiar el formulario
        cancelForm.reset();
    });
}

// Función para mostrar popup de confirmación de reserva
function showReservationPopup(codigoReserva, emailCliente) {
    // Crear el popup
    const popup = document.createElement('div');
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content">
                <div class="popup-header">
                    <h2>¡Reserva Confirmada!</h2>
                    <span class="popup-close">&times;</span>
                </div>
                <div class="popup-body">
                    <p>Su reserva ha sido registrada exitosamente.</p>
                    <div class="reservation-details">
                        <p><strong>Código de reserva:</strong> ${codigoReserva}</p>
                        <p><strong>Email de confirmación:</strong> ${emailCliente}</p>
                    </div>
                    <p>Hemos enviado un correo de confirmación con todos los detalles.</p>
                    <p>Para cancelar su reserva, puede responder al correo con "CANCELAR" o usar el formulario de cancelación en nuestra web.</p>
                </div>
                <div class="popup-footer">
                    <button class="btn-submit popup-close">Aceptar</button>
                </div>
            </div>
        </div>
    `;
    
    // Agregar estilos para el popup
    const styles = document.createElement('style');
    styles.textContent = `
        .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(5px);
        }
        
        .popup-content {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: popupFadeIn 0.3s ease-out;
        }
        
        @keyframes popupFadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        .popup-header {
            padding: 25px 30px 15px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .popup-header h2 {
            margin: 0;
            color: #2C4A7C;
            font-size: 1.8em;
        }
        
        .popup-close {
            background: none;
            border: none;
            font-size: 2em;
            cursor: pointer;
            color: #999;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s;
        }
        
        .popup-close:hover {
            background: #f5f5f5;
            color: #333;
        }
        
        .popup-body {
            padding: 25px 30px;
        }
        
        .popup-body p {
            margin-bottom: 15px;
            line-height: 1.6;
        }
        
        .reservation-details {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
        }
        
        .reservation-details p {
            margin: 10px 0;
            font-size: 0.95em;
        }
        
        .popup-footer {
            padding: 20px 30px;
            border-top: 1px solid #eee;
            text-align: right;
        }
        
        .popup-footer .btn-submit {
            margin: 0;
            padding: 12px 30px;
            width: auto;
        }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(popup);
    
    // Agregar eventos para cerrar el popup
    const closeButtons = popup.querySelectorAll('.popup-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.head.removeChild(styles);
            document.body.removeChild(popup);
        });
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            document.head.removeChild(styles);
            document.body.removeChild(popup);
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Función para mostrar popup de confirmación de cancelación
function showCancellationPopup() {
    // Crear el popup
    const popup = document.createElement('div');
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content">
                <div class="popup-header">
                    <h2>Reserva Cancelada</h2>
                    <span class="popup-close">&times;</span>
                </div>
                <div class="popup-body">
                    <p>Su reserva ha sido cancelada exitosamente.</p>
                    <p>Recibirá un correo de confirmación con todos los detalles en breve.</p>
                    <p>Si tiene alguna pregunta adicional, no dude en contactarnos.</p>
                </div>
                <div class="popup-footer">
                    <button class="btn-submit popup-close">Aceptar</button>
                </div>
            </div>
        </div>
    `;
    
    // Agregar estilos para el popup (reutilizamos los mismos estilos)
    const styles = document.createElement('style');
    styles.textContent = `
        .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(5px);
        }
        
        .popup-content {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: popupFadeIn 0.3s ease-out;
        }
        
        @keyframes popupFadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        .popup-header {
            padding: 25px 30px 15px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .popup-header h2 {
            margin: 0;
            color: #2C4A7C;
            font-size: 1.8em;
        }
        
        .popup-close {
            background: none;
            border: none;
            font-size: 2em;
            cursor: pointer;
            color: #999;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s;
        }
        
        .popup-close:hover {
            background: #f5f5f5;
            color: #333;
        }
        
        .popup-body {
            padding: 25px 30px;
        }
        
        .popup-body p {
            margin-bottom: 15px;
            line-height: 1.6;
        }
        
        .reservation-details {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
        }
        
        .reservation-details p {
            margin: 10px 0;
            font-size: 0.95em;
        }
        
        .popup-footer {
            padding: 20px 30px;
            border-top: 1px solid #eee;
            text-align: center;
        }
        
        .popup-footer .btn-submit {
            margin: 0;
            padding: 12px 30px;
            width: auto;
            background: linear-gradient(135deg, #5B8DB8, #3B5998);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.15em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            box-shadow: 0 6px 20px rgba(59, 89, 152, 0.3);
        }
        
        .popup-footer .btn-submit:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(59, 89, 152, 0.4);
        }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(popup);
    
    // Agregar eventos para cerrar el popup
    const closeButtons = popup.querySelectorAll('.popup-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.head.removeChild(styles);
            document.body.removeChild(popup);
        });
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            document.head.removeChild(styles);
            document.body.removeChild(popup);
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Función para mostrar mensaje al regresar a la página
function showReturnMessage() {
    // Verificar si hay mensajes pendientes
    const reservationCompleted = localStorage.getItem('reservationCompleted');
    const cancellationCompleted = localStorage.getItem('cancellationCompleted');
    
    if (reservationCompleted) {
        const codigoReserva = localStorage.getItem('reservationCode');
        const emailCliente = localStorage.getItem('clientEmail');
        
        // Mostrar popup de confirmación
        setTimeout(() => {
            showReservationPopup(codigoReserva, emailCliente);
        }, 1000);
        
        // Limpiar localStorage
        localStorage.removeItem('reservationCompleted');
        localStorage.removeItem('reservationCode');
        localStorage.removeItem('clientEmail');
    }
    
    if (cancellationCompleted) {
        // Mostrar popup de cancelación
        setTimeout(() => {
            showCancellationPopup();
        }, 1000);
        
        // Limpiar localStorage
        localStorage.removeItem('cancellationCompleted');
    }
}

// Mostrar mensaje al cargar la página si es necesario
document.addEventListener('DOMContentLoaded', function() {
    showReturnMessage();
    initOSMAutocomplete();
});

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// Función para guardar la reserva en el backend
async function saveReservation(datosReserva) {
    try {
        // Enviar reserva al backend
        const response = await fetch(`${RESERVAS_CONFIG.apiUrl}/reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosReserva)
        });
        
        if (!response.ok) {
            throw new Error(`Error al guardar reserva: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error guardando reserva en backend:', error);
        // Fallback a localStorage en caso de error
        try {
            let reservas = JSON.parse(localStorage.getItem('reservas_backup') || '{}');
            reservas[datosReserva.codigo_reserva] = {
                ...datosReserva,
                timestamp: new Date().toISOString(),
                estado: 'activa'
            };
            localStorage.setItem('reservas_backup', JSON.stringify(reservas));
            return { success: true, backup: true };
        } catch (backupError) {
            console.error('Error en respaldo de reserva:', backupError);
            return { success: false, error: backupError.message };
        }
    }
}

// Función para obtener una reserva por su código desde el backend
async function getReservationByCode(codigoReserva) {
    try {
        // Obtener reserva del backend
        const response = await fetch(`${RESERVAS_CONFIG.apiUrl}/reservas/${codigoReserva}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                return null; // Reserva no encontrada
            }
            throw new Error(`Error al obtener reserva: ${response.status}`);
        }
        
        const reserva = await response.json();
        // Verificar que la reserva esté activa
        if (reserva && reserva.estado === 'activa') {
            return reserva;
        }
        return null;
    } catch (error) {
        console.error('Error obteniendo reserva del backend:', error);
        // Intentar obtener desde localStorage en caso de error
        try {
            const reservas = JSON.parse(localStorage.getItem('reservas_backup') || '{}');
            const reserva = reservas[codigoReserva];
            if (reserva && reserva.estado === 'activa') {
                return reserva;
            }
            return null;
        } catch (backupError) {
            console.error('Error en respaldo de obtención de reserva:', backupError);
            return null;
        }
    }
}

// Función para eliminar una reserva (cancelar)
async function removeReservation(codigoReserva) {
    try {
        // Cancelar reserva en el backend
        const response = await fetch(`${RESERVAS_CONFIG.apiUrl}/reservas/${codigoReserva}/cancelar`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error(`Error al cancelar reserva: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error cancelando reserva en backend:', error);
        // Fallback a localStorage en caso de error
        try {
            const reservas = JSON.parse(localStorage.getItem('reservas_backup') || '{}');
            if (reservas[codigoReserva]) {
                reservas[codigoReserva].estado = 'cancelada';
                reservas[codigoReserva].fechaCancelacion = new Date().toISOString();
                localStorage.setItem('reservas_backup', JSON.stringify(reservas));
                return { success: true, backup: true };
            } else {
                return { success: false, error: 'Reserva no encontrada' };
            }
        } catch (backupError) {
            console.error('Error en respaldo de cancelación de reserva:', backupError);
            return { success: false, error: backupError.message };
        }
    }
}

// Función para verificar la conexión con Airtable
async function testAirtableConnection() {
    if (!isAirtableConfigured) {
        console.log("Airtable no está configurado. Usando valores de ejemplo.");
        return false;
    }
    
    try {
        const response = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}?maxRecords=1`,
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`
                }
            }
        );
        
        if (response.ok) {
            console.log("✅ Conexión con Airtable exitosa");
            return true;
        } else {
            const errorData = await response.text();
            console.error("❌ Error en la conexión con Airtable:", response.status, response.statusText);
            console.error("Detalles del error:", errorData);
            return false;
        }
    } catch (error) {
        console.error("❌ Error al conectar con Airtable:", error);
        return false;
    }
}

// Función de prueba para crear un registro de ejemplo
async function testAirtableWrite() {
    if (!isAirtableConfigured) {
        console.log("Airtable no está configurado. No se puede probar escritura.");
        return false;
    }
    
    try {
        const testData = {
            fields: {
                "Código de Reserva": "TEST-" + Date.now(),
                "Email Cliente": "test@example.com",
                "Fecha": new Date().toISOString().split('T')[0],
                "Hora": "12:00",
                "Origen": "Prueba Origen",
                "Destino": "Prueba Destino",
                "Pasajeros": "2",
                "Teléfono": "+54 9 11 1234-5678",
                "Equipaje": true,
                "Maletas": "2 maletas",
                "Timestamp": new Date().toISOString()
            }
        };
        
        const response = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testData)
            }
        );
        
        if (response.ok) {
            const result = await response.json();
            console.log("✅ Prueba de escritura en Airtable exitosa");
            console.log("Registro creado:", result.id);
            
            // Eliminar el registro de prueba
            await fetch(
                `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}/${result.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`
                    }
                }
            );
            
            return true;
        } else {
            const errorData = await response.text();
            console.error("❌ Error en la prueba de escritura:", response.status, response.statusText);
            console.error("Detalles del error:", errorData);
            return false;
        }
    } catch (error) {
        console.error("❌ Error en la prueba de escritura:", error);
        return false;
    }
}

// Inicializar autocompletado cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initOSMAutocomplete();
    // Verificar la conexión con Airtable
    testAirtableConnection().then(success => {
        if (success) {
            // Si la conexión es exitosa, hacer una prueba de escritura
            testAirtableWrite();
        }
    });
});

function scrollToForm(e) {
    e.preventDefault();
    document.querySelector('.booking-form').scrollIntoView({ behavior: 'smooth' });
}
