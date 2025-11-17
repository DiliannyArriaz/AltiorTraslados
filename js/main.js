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

// Variables para el autocompletado con OpenStreetMap
let origenSuggestionsContainer;
let destinoSuggestionsContainer;
let origenTimeout;
let destinoTimeout;

// Crear contenedores de sugerencias
function createSuggestionsContainer(input) {
    const container = document.createElement('div');
    container.className = 'suggestions-container';
    container.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
        display: none;
    `;
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(container);
    return container;
}

// Buscar lugares comunes que coincidan
function searchLugaresComunes(query) {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return lugaresComunes.filter(lugar => 
        lugar.nombre.toLowerCase().includes(searchTerm)
    );
}

// Verificar si una dirección está en el área permitida
function isDireccionPermitida(direccion) {
    const direccionLower = direccion.toLowerCase();
    
    // Verificar si alguna de las localidades permitidas está en la dirección
    return partidosPermitidos.some(partido => 
        direccionLower.includes(partido.toLowerCase())
    );
}

// Buscar direcciones con Nominatim (OpenStreetMap) filtradas por área
async function searchAddresses(query, limit = 5) {
    if (!query.trim()) return [];
    
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(query)}&` +
            `format=json&` +
            `countrycodes=AR&` +
            `limit=20&` + // Pedir más resultados para filtrar
            `addressdetails=1`
        );
        
        const results = await response.json();
        
        // Filtrar resultados por área permitida
        const filteredResults = results.filter(item => 
            isDireccionPermitida(item.display_name)
        );
        
        // Tomar solo los primeros 'limit' resultados
        return filteredResults.slice(0, limit).map(item => ({
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon
        }));
    } catch (error) {
        console.error('Error buscando direcciones:', error);
        return [];
    }
}

// Mostrar sugerencias (lugares comunes + direcciones)
async function showAllSuggestions(input, suggestionsContainer, query) {
    suggestionsContainer.innerHTML = '';
    
    // Buscar lugares comunes
    const lugares = searchLugaresComunes(query);
    
    // Buscar direcciones de OSM solo si no hay coincidencias exactas de lugares comunes
    let direcciones = [];
    if (lugares.length === 0 || query.length > 3) {
        direcciones = await searchAddresses(query, 5);
    }
    
    // Combinar resultados (lugares comunes primero)
    const allSuggestions = [
        ...lugares.map(lugar => ({ 
            display_name: lugar.nombre, 
            full_address: lugar.direccion,
            isCommonPlace: true 
        })),
        ...direcciones.map(direccion => ({ 
            display_name: direccion.display_name, 
            lat: direccion.lat, 
            lon: direccion.lon,
            isCommonPlace: false 
        }))
    ];
    
    if (allSuggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    allSuggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = suggestion.display_name;
        suggestionItem.style.cssText = `
            padding: 12px 16px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
            font-size: 0.9em;
            display: flex;
            align-items: center;
        `;
        
        // Agregar ícono para lugares comunes
        if (suggestion.isCommonPlace) {
            suggestionItem.style.fontWeight = '600';
            suggestionItem.style.color = '#2C4A7C';
        }
        
        suggestionItem.addEventListener('click', () => {
            if (suggestion.isCommonPlace) {
                input.value = suggestion.display_name;
                // Guardar la dirección completa en un atributo data
                input.setAttribute('data-full-address', suggestion.full_address);
            } else {
                input.value = suggestion.display_name;
                input.removeAttribute('data-full-address');
            }
            suggestionsContainer.style.display = 'none';
        });
        
        suggestionItem.addEventListener('mouseenter', () => {
            suggestionItem.style.backgroundColor = '#f5f8fc';
        });
        
        suggestionItem.addEventListener('mouseleave', () => {
            suggestionItem.style.backgroundColor = 'white';
        });
        
        suggestionsContainer.appendChild(suggestionItem);
    });
    
    suggestionsContainer.style.display = 'block';
}

// Inicializar autocompletado con lugares comunes + OpenStreetMap
function initOSMAutocomplete() {
    const origenInput = document.getElementById('origen');
    const destinoInput = document.getElementById('destino');
    
    // Crear contenedores de sugerencias
    origenSuggestionsContainer = createSuggestionsContainer(origenInput);
    destinoSuggestionsContainer = createSuggestionsContainer(destinoInput);
    
    // Event listeners para autocompletado
    origenInput.addEventListener('input', function() {
        clearTimeout(origenTimeout);
        origenTimeout = setTimeout(() => {
            showAllSuggestions(origenInput, origenSuggestionsContainer, this.value);
        }, 300);
    });
    
    destinoInput.addEventListener('input', function() {
        clearTimeout(destinoTimeout);
        destinoTimeout = setTimeout(() => {
            showAllSuggestions(destinoInput, destinoSuggestionsContainer, this.value);
        }, 300);
    });
    
    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (e.target !== origenInput && !origenSuggestionsContainer.contains(e.target)) {
            origenSuggestionsContainer.style.display = 'none';
        }
        
        if (e.target !== destinoInput && !destinoSuggestionsContainer.contains(e.target)) {
            destinoSuggestionsContainer.style.display = 'none';
        }
    });
    
    // Cerrar sugerencias con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            origenSuggestionsContainer.style.display = 'none';
            destinoSuggestionsContainer.style.display = 'none';
        }
    });
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

Código de Reserva: ${datos.codigo_reserva}
Fecha: ${datos.fecha}
Hora: ${datos.hora}
Origen: ${datos.origen}
Destino: ${datos.destino}
Pasajeros: ${datos.pasajeros}
Teléfono: ${datos.telefono}
Equipaje: ${datos.equipaje}
Maletas: ${datos.maletas}

Cliente: ${datos.email_cliente}`
        };
        
        // Datos para el correo al cliente
        const clienteData = {
            ...datos,
            subject: 'Confirmación de Reserva - Altior Traslados',
            _replyto: 'altior.traslados@gmail.com',
            mensaje_cliente: `¡Gracias por tu reserva!

Detalles de tu reserva:
Código de Reserva: ${datos.codigo_reserva}
Fecha: ${datos.fecha}
Hora: ${datos.hora}
Origen: ${datos.origen}
Destino: ${datos.destino}
Pasajeros: ${datos.pasajeros}
Equipaje: ${datos.equipaje}
Maletas: ${datos.maletas}

Para cancelar tu reserva, responde a este correo con "CANCELAR ${datos.codigo_reserva}" 
o visita nuestra página web y usa el formulario de cancelación.

¡Esperamos verte pronto!

Atentamente,
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
            mensaje_cliente: `Hola,

Hemos recibido tu solicitud de cancelación para la reserva ${datosReales.codigo_reserva}.

Confirmamos que tu reserva ha sido cancelada exitosamente.

Detalles de la reserva cancelada:
Código de Reserva: ${datosReales.codigo_reserva}
Fecha: ${datosReales.fecha}
Hora: ${datosReales.hora}
Origen: ${datosReales.origen}
Destino: ${datosReales.destino}

Si tienes alguna pregunta, no dudes en contactarnos.

¡Gracias por avisarnos!

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

equipajeCheckbox.addEventListener('change', function() {
    if(this.checked) {
        luggageDetails.classList.add('active');
    } else {
        luggageDetails.classList.remove('active');
    }
});

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
document.getElementById('cancelForm').addEventListener('submit', async function(e) {
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
    document.getElementById('cancelForm').reset();
});

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

// Función para guardar la reserva en Airtable o en localStorage como respaldo
async function saveReservation(datosReserva) {
    try {
        // Si Airtable está configurado, guardar en la nube
        if (isAirtableConfigured) {
            const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        "Código de Reserva": datosReserva.codigo_reserva,
                        "Email Cliente": datosReserva.email_cliente,
                        "Fecha": datosReserva.fecha,
                        "Hora": datosReserva.hora,
                        "Origen": datosReserva.origen,
                        "Destino": datosReserva.destino,
                        "Pasajeros": datosReserva.pasajeros,
                        "Teléfono": datosReserva.telefono,
                        "Equipaje": datosReserva.equipaje,
                        "Maletas": datosReserva.maletas,
                        "Timestamp": new Date().toISOString()
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Error en Airtable: ${response.status}`);
            }
            
            return await response.json();
        } else {
            // Respaldar en localStorage si Airtable no está disponible
            let reservas = JSON.parse(localStorage.getItem('reservas') || '{}');
            reservas[datosReserva.codigo_reserva] = {
                ...datosReserva,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('reservas', JSON.stringify(reservas));
            return { success: true };
        }
    } catch (error) {
        console.error('Error guardando reserva en Airtable:', error);
        // Respaldar en localStorage en caso de error
        try {
            let reservas = JSON.parse(localStorage.getItem('reservas') || '{}');
            reservas[datosReserva.codigo_reserva] = {
                ...datosReserva,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('reservas', JSON.stringify(reservas));
            return { success: true, backup: true };
        } catch (backupError) {
            console.error('Error en respaldo de reserva:', backupError);
            return { success: false, error: backupError.message };
        }
    }
}

// Función para obtener una reserva por su código desde Airtable o localStorage
async function getReservationByCode(codigoReserva) {
    try {
        // Si Airtable está configurado, obtener desde la nube
        if (isAirtableConfigured) {
            const response = await fetch(
                `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}?filterByFormula=({Código de Reserva} = '${codigoReserva}')`,
                {
                    headers: {
                        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`Error en Airtable: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.records && data.records.length > 0) {
                const record = data.records[0];
                return {
                    codigo_reserva: record.fields["Código de Reserva"],
                    email_cliente: record.fields["Email Cliente"],
                    fecha: record.fields["Fecha"],
                    hora: record.fields["Hora"],
                    origen: record.fields["Origen"],
                    destino: record.fields["Destino"],
                    pasajeros: record.fields["Pasajeros"],
                    telefono: record.fields["Teléfono"],
                    equipaje: record.fields["Equipaje"],
                    maletas: record.fields["Maletas"]
                };
            }
            return null;
        } else {
            // Obtener desde localStorage si Airtable no está disponible
            const reservas = JSON.parse(localStorage.getItem('reservas') || '{}');
            return reservas[codigoReserva] || null;
        }
    } catch (error) {
        console.error('Error obteniendo reserva de Airtable:', error);
        // Intentar obtener desde localStorage en caso de error
        try {
            const reservas = JSON.parse(localStorage.getItem('reservas') || '{}');
            return reservas[codigoReserva] || null;
        } catch (backupError) {
            console.error('Error en respaldo de obtención de reserva:', backupError);
            return null;
        }
    }
}

// Función para eliminar una reserva en Airtable o localStorage
async function removeReservation(codigoReserva) {
    try {
        // Si Airtable está configurado, primero obtener el record ID y luego eliminar
        if (isAirtableConfigured) {
            // Primero obtener el record ID
            const response = await fetch(
                `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}?filterByFormula=({Código de Reserva} = '${codigoReserva}')`,
                {
                    headers: {
                        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`Error obteniendo record de Airtable: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.records && data.records.length > 0) {
                const recordId = data.records[0].id;
                
                // Eliminar el registro
                const deleteResponse = await fetch(
                    `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}/${recordId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`
                        }
                    }
                );
                
                if (!deleteResponse.ok) {
                    throw new Error(`Error eliminando de Airtable: ${deleteResponse.status}`);
                }
                
                return await deleteResponse.json();
            }
        } else {
            // Eliminar de localStorage si Airtable no está disponible
            const reservas = JSON.parse(localStorage.getItem('reservas') || '{}');
            delete reservas[codigoReserva];
            localStorage.setItem('reservas', JSON.stringify(reservas));
            return { success: true };
        }
    } catch (error) {
        console.error('Error eliminando reserva de Airtable:', error);
        // Intentar eliminar de localStorage en caso de error
        try {
            const reservas = JSON.parse(localStorage.getItem('reservas') || '{}');
            delete reservas[codigoReserva];
            localStorage.setItem('reservas', JSON.stringify(reservas));
            return { success: true, backup: true };
        } catch (backupError) {
            console.error('Error en respaldo de eliminación de reserva:', backupError);
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
