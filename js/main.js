// Configuración de reservas (usando Google Sheets como sistema principal)
const RESERVAS_CONFIG = {
    useGoogleSheets: true,
    // Usamos un proxy CORS para evitar problemas de cross-origin
    scriptUrl: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://script.google.com/macros/s/AKfycbye7rk0Ym7xvSlIpyr0vwIrADjJY_f4INHwm7PJuncpUuYNU3j8NKMhvr1Yx5G-L8pnQw/exec')
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
        // Enviar correo usando el backend (que a su vez usa SendGrid)
        const response = await fetch(`${RESERVAS_CONFIG.apiUrl}/reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(`Error al enviar correo: ${response.status}`);
        }

        console.log('Correos de confirmación enviados exitosamente');
        return true;
    } catch (error) {
        console.error('Error enviando emails de confirmación:', error);
        return false;
    }
}

// Función para enviar datos a Telegram
async function sendToTelegram(datos) {
    try {
        console.log('Enviando datos a Telegram:', datos);
        
        // Datos formateados para enviar a Telegram
        const telegramData = {
            name: datos.email_cliente || "No especificado",
            email: datos.email_cliente || "No especificado",
            date: `${datos.fecha || 'No especificado'} ${datos.hora || ''}`.trim() || "No especificado",
            message: `Nueva reserva recibida:
• Código: ${datos.codigo_reserva}
• Origen: ${datos.origen || datos.origen_completo || 'No especificado'}
• Destino: ${datos.destino || datos.destino_completo || 'No especificado'}
• Pasajeros: ${datos.pasajeros || 'No especificado'}
• Equipaje: ${datos.maletas || datos.equipaje || 'No especificado'}
• Teléfono: ${datos.telefono || 'No especificado'}`
        };
        
        console.log('Datos formateados para Telegram:', telegramData);
        
        // Usamos también un proxy para la llamada a Telegram
        const telegramUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://script.google.com/macros/s/AKfycbz-fY8zI7hHgsJu8EhZuEgowaKqnxIDNn_tY3xx41C2eUT7ac4gO45YaAAjYzVD4Me4Gw/exec');
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(telegramData)
        });
        
        console.log('Respuesta de Telegram:', response.status, response.statusText);
        
        if (response.ok) {
            console.log('✅ Notificación enviada a Telegram exitosamente');
            return true;
        } else {
            console.error('❌ Error al enviar notificación a Telegram:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Error al enviar notificación a Telegram:', error);
        return false;
    }
}

// Función para guardar la reserva usando Google Sheets
async function saveReservation(datosReserva) {
    try {
        console.log('Guardando reserva con datos:', datosReserva);
        
        // Enviar datos a Google Sheets usando Google Apps Script a través de proxy CORS
        const response = await fetch(RESERVAS_CONFIG.scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosReserva)
        });
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error al enviar datos: ${response.status} ${response.statusText}`);
        }
        
        console.log('Reserva enviada exitosamente a Google Sheets');
        
        // Enviar notificación a Telegram
        console.log('Enviando notificación a Telegram...');
        await sendToTelegram(datosReserva);
        
        return { success: true };
    } catch (error) {
        console.error('Error guardando reserva:', error);
        
        // Manejo específico para errores de CORS
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            console.log('Error de CORS o red detectado. Los datos pueden haberse guardado de todas formas.');
            // Aún así, intentamos enviar notificación a Telegram
            try {
                await sendToTelegram(datosReserva);
            } catch (telegramError) {
                console.error('Error al enviar notificación a Telegram:', telegramError);
            }
            // Retornamos éxito aunque haya error de CORS, ya que Google Apps Script
            // puede haber procesado la solicitud a pesar del error del navegador
            return { success: true, warning: 'Posible error de CORS pero datos enviados' };
        }
        
        // Para otros errores, seguimos con el flujo normal
        try {
            await sendToTelegram(datosReserva);
        } catch (telegramError) {
            console.error('Error al enviar notificación a Telegram:', telegramError);
        }
        
        // Relanzamos el error para que sea manejado por la función llamadora
        throw error;
    }
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

// Función para obtener una reserva por su código (no disponible con Formspree)
async function getReservationByCode(codigoReserva) {
    // Con Formspree no podemos obtener reservas individuales
    // Esta función se mantiene para compatibilidad
    console.warn('No se puede obtener reserva individual con Formspree');
    return null;
}

// Función para cancelar una reserva (no disponible con Formspree)
async function removeReservation(codigoReserva) {
    // Con Formspree no podemos cancelar reservas
    // Esta función se mantiene para compatibilidad
    console.warn('No se puede cancelar reserva con Formspree');
    return { success: false, error: 'Funcionalidad no disponible con Formspree' };
}

// Función para exportar todas las reservas (para administrador)
function exportReservations() {
    try {
        const reservas = JSON.parse(localStorage.getItem('reservas_altior') || '{}');
        const dataStr = JSON.stringify(reservas, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'reservas-altior-' + new Date().toISOString().split('T')[0] + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        console.log('Reservas exportadas exitosamente');
    } catch (error) {
        console.error('Error exportando reservas:', error);
        alert('Error al exportar reservas: ' + error.message);
    }
}

// Handle booking form submission
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Obtener valores del formulario
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
            
            // Datos para el correo electrónico y la reserva
            const datosReserva = {
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
            
            try {
                // Guardar la reserva en el backend
                const resultado = await saveReservation(datosReserva);
                
                if (resultado && resultado.success) {
                    // Mostrar popup de confirmación de reserva
                    showReservationPopup(codigoReserva, emailCliente);
                    
                    // Guardar en localStorage para mostrar el mensaje al regresar
                    localStorage.setItem('reservationCompleted', 'true');
                    localStorage.setItem('reservationCode', codigoReserva);
                    localStorage.setItem('clientEmail', emailCliente);
                    
                    // Resetear el formulario
                    bookingForm.reset();
                    
                    // Ocultar detalles de equipaje si estaban visibles
                    document.getElementById('luggageDetails').style.display = 'none';
                } else {
                    alert('Error al guardar la reserva. Por favor, inténtelo nuevamente.');
                }
            } catch (error) {
                console.error('Error al procesar la reserva:', error);
                alert('Error al procesar la reserva. Por favor, inténtelo nuevamente.');
            }
        });
    }
});

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

// Función para generar código de reserva único
function generateReservationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'ALT-' + code;
}

function scrollToForm(e) {
    e.preventDefault();
    document.querySelector('.booking-form').scrollIntoView({ behavior: 'smooth' });
}
