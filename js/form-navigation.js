// Script para manejar la navegación entre pasos del formulario
document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los botones de navegación
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const formSteps = document.querySelectorAll('.form-step');
    const bookingForm = document.getElementById('bookingForm');
    
    // Añadir event listeners para la conversión de campos
    const origenInput = document.getElementById('origen');
    const destinoInput = document.getElementById('destino');
    
    // Variables para rastrear el estado previo
    let origenPrevValue = '';
    let destinoPrevValue = '';
    
    // Bandera para evitar bucles de conversión
    let isProcessingConversion = false;
    
    if (origenInput) {
        origenInput.addEventListener('input', function() {
            limpiarError(this); // Limpiar error cuando se escribe en origen
            
            // Evitar procesamiento si estamos en medio de una conversión
            if (isProcessingConversion) return;
            
            // Solo procesar si el valor ha cambiado significativamente
            if (this.value.trim() !== origenPrevValue) {
                origenPrevValue = this.value.trim();
                
                // Marcar que estamos procesando una conversión
                isProcessingConversion = true;
                handleFieldConversion();
                // Desmarcar después de un breve tiempo para evitar bucles
                setTimeout(() => {
                    isProcessingConversion = false;
                }, 100);
            }
        });
    }
    
    if (destinoInput) {
        destinoInput.addEventListener('input', function() {
            limpiarError(this); // Limpiar error cuando se escribe en destino
            
            // Evitar procesamiento si estamos en medio de una conversión
            if (isProcessingConversion) return;
            
            // Solo procesar si el valor ha cambiado significativamente
            if (this.value.trim() !== destinoPrevValue) {
                destinoPrevValue = this.value.trim();
                
                // Marcar que estamos procesando una conversión
                isProcessingConversion = true;
                handleFieldConversion();
                // Desmarcar después de un breve tiempo para evitar bucles
                setTimeout(() => {
                    isProcessingConversion = false;
                }, 100);
            }
        });
    }
    
    // Zonas disponibles del sistema existente
    const ZONAS = [
        'CABA',
        'Avellaneda / Lanús',
        'Wilde / Monte Chingolo',
        'Quilmes / Alte Brown',
        'Berazategui / Hudson',
        'Lomas de Zamora',
        'Canning / Spegazzini',
        'La Plata',
        'Ramos Mejía / Ciudadela',
        'Morón / Haedo',
        'Caseros / El Palomar',
        'Hurlingham / Loma Hermosa',
        'Ituzaingó / Padua',
        'San Miguel / José C. Paz',
        'Merlo / Paso del Rey',
        'Moreno / Francisco Álvarez',
        'Gral. Rodríguez',
        'Luján',
        'Vicente López / Olivos',
        'San Martín / San Andrés',
        'San Isidro / Boulogne',
        'Villa Ballester / José León Suárez',
        'Tigre Centro / Pacheco',
        'Don Torcuato / Grand Bourg',
        'Benavídez / Milberg / Tortuguitas',
        'Ing. Maschwitz / Del Viso',
        'Pilar / Escobar',
        'Campana / Cardales'
    ];
    
    // Aeropuertos disponibles
    const AEROPUERTOS = [
        { nombre: "Aeropuerto Ezeiza", direccion: "Aeropuerto Internacional Ministro Pistarini, Ezeiza, Buenos Aires" },
        { nombre: "Aeropuerto Aeroparque", direccion: "Aeropuerto Jorge Newbery, Ciudad Autónoma de Buenos Aires" }
    ];
    
    // Cargar zonas en el select
    function cargarZonas() {
        const zonaSelect = document.getElementById('zona');
        if (zonaSelect) {
            // Limpiar opciones existentes excepto la primera
            zonaSelect.innerHTML = '<option value="">Seleccione una zona</option>';
            
            // Agregar todas las zonas
            ZONAS.forEach(zona => {
                const option = document.createElement('option');
                option.value = zona;
                option.textContent = zona;
                zonaSelect.appendChild(option);
            });
        }
    }
    
    // Función para crear un dropdown de aeropuertos
    function createAirportDropdown(inputElement) {
        // Crear un select
        const select = document.createElement('select');
        select.className = inputElement.className;
        select.id = inputElement.id;
        select.name = inputElement.name;
        select.required = inputElement.required;
        
        // Copiar todos los atributos del input original
        for (let attr of inputElement.attributes) {
            if (!['type', 'id', 'name', 'class', 'required'].includes(attr.name)) {
                select.setAttribute(attr.name, attr.value);
            }
        }
        
        // Agregar opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione un aeropuerto';
        select.appendChild(defaultOption);
        
        // Agregar aeropuertos
        AEROPUERTOS.forEach(airport => {
            const option = document.createElement('option');
            option.value = airport.nombre;
            option.textContent = airport.nombre;
            select.appendChild(option);
        });
        
        // Reemplazar el input con el select
        inputElement.parentNode.replaceChild(select, inputElement);
        
        return select;
    }
    
    // Función para restaurar un input normal
    function restoreNormalInput(selectElement, originalType) {
        // Guardar el valor actual
        const currentValue = selectElement.value;
        
        // Crear un input
        const input = document.createElement('input');
        input.type = originalType || 'text';
        input.className = selectElement.className;
        input.id = selectElement.id;
        input.name = selectElement.name;
        input.required = selectElement.required;
        input.value = currentValue; // Mantener el valor
        
        // Copiar todos los atributos del select original
        for (let attr of selectElement.attributes) {
            if (!['type', 'id', 'name', 'class', 'required'].includes(attr.name)) {
                input.setAttribute(attr.name, attr.value);
            }
        }
        
        // Reemplazar el select con el input
        selectElement.parentNode.replaceChild(input, selectElement);
        
        // Volver a asociar el evento input para este campo específico
        input.addEventListener('input', function() {
            limpiarError(this); // Limpiar error cuando se escribe
            
            // Evitar procesamiento si estamos en medio de una conversión
            if (isProcessingConversion) return;
            
            // Solo procesar si el valor ha cambiado significativamente
            if (this.value.trim() !== (this.id === 'origen' ? origenPrevValue : destinoPrevValue)) {
                if (this.id === 'origen') {
                    origenPrevValue = this.value.trim();
                } else {
                    destinoPrevValue = this.value.trim();
                }
                
                // Marcar que estamos procesando una conversión
                isProcessingConversion = true;
                handleFieldConversion();
                // Desmarcar después de un breve tiempo para evitar bucles
                setTimeout(() => {
                    isProcessingConversion = false;
                }, 100);
            }
        });
        
        // Si el input restaurado es 'origen' o 'destino', asegurarse de que el autocompletado funcione
        if (input.id === 'origen' || input.id === 'destino') {
            // Reiniciar el autocompletado para este campo
            setTimeout(() => {
                if (typeof initAutocomplete === 'function') {
                    initAutocomplete(input.id, input.id + '-suggestions');
                }
            }, 50);
        }
        
        return input;
    }
    
    // Función para manejar la conversión de campos
    function handleFieldConversion() {
        const origenInput = document.getElementById('origen');
        const destinoInput = document.getElementById('destino');
        
        if (!origenInput || !destinoInput) return;
        
        // Verificar si cada campo tiene valor
        const origenHasValue = origenInput.value.trim() !== '';
        const destinoHasValue = destinoInput.value.trim() !== '';
        
        // Verificar si el origen es un aeropuerto (si coincide exactamente con un nombre de aeropuerto)
        const origenIsAirport = AEROPUERTOS.some(airport => 
            origenInput.value.toLowerCase().trim() === airport.nombre.toLowerCase()
        );
        
        // Verificar si el destino es un aeropuerto (si coincide exactamente con un nombre de aeropuerto)
        const destinoIsAirport = AEROPUERTOS.some(airport => 
            destinoInput.value.toLowerCase().trim() === airport.nombre.toLowerCase()
        );
        
        // Si origen es un aeropuerto y destino no es un input, restaurar destino a input
        if (origenIsAirport && destinoInput.tagName === 'SELECT') {
            restoreNormalInput(destinoInput, 'text');
        }
        // Si destino es un aeropuerto y origen no es un input, restaurar origen a input
        else if (destinoIsAirport && origenInput.tagName === 'SELECT') {
            restoreNormalInput(origenInput, 'text');
        }
        // Si ambos campos están vacíos, restaurar ambos a inputs normales
        else if (!origenHasValue && !destinoHasValue) {
            if (origenInput.tagName === 'SELECT') {
                restoreNormalInput(origenInput, 'text');
            }
            if (destinoInput.tagName === 'SELECT') {
                restoreNormalInput(destinoInput, 'text');
            }
        }
        // Si origen no es aeropuerto pero tiene valor y destino no es select, convertir destino a dropdown
        else if (!origenIsAirport && origenHasValue && destinoInput.tagName !== 'SELECT') {
            createAirportDropdown(destinoInput);
        }
        // Si destino no es aeropuerto pero tiene valor y origen no es select, convertir origen a dropdown
        else if (!destinoIsAirport && destinoHasValue && origenInput.tagName !== 'SELECT') {
            createAirportDropdown(origenInput);
        }
        // Si origen está vacío y destino es select, restaurar destino a input
        else if (!origenHasValue && destinoInput.tagName === 'SELECT') {
            restoreNormalInput(destinoInput, 'text');
        }
        // Si destino está vacío y origen es select, restaurar origen a input
        else if (!destinoHasValue && origenInput.tagName === 'SELECT') {
            restoreNormalInput(origenInput, 'text');
        }
    }
    
    // Función para mostrar un paso específico
    function showStep(stepNumber) {
        // Ocultar todos los pasos
        formSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Mostrar el paso solicitado
        const targetStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (targetStep) {
            targetStep.classList.add('active');
        }
        
        // Actualizar indicador de pasos
        updateStepIndicator(stepNumber);
    }
    
    // Función para actualizar el indicador de pasos
    function updateStepIndicator(currentStep) {
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => {
            step.classList.remove('active', 'completed');
            
            const stepNum = parseInt(step.getAttribute('data-step'));
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('completed');
            }
        });
    }
    
    // Validar paso 1
    function validarPaso1() {
        let isValid = true;
        const fecha = document.getElementById('fecha');
        const hora = document.getElementById('hora');
        
        // Limpiar errores previos
        limpiarErroresPaso1();
        
        if (!fecha.value) {
            mostrarError(fecha, 'Por favor complete la fecha');
            isValid = false;
        }
        
        if (!hora.value) {
            mostrarError(hora, 'Por favor complete la hora');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Validar paso 2
    function validarPaso2() {
        let isValid = true;
        const origen = document.getElementById('origen');
        const destino = document.getElementById('destino');
        
        // Limpiar errores previos
        limpiarErroresPaso2();
        
        if (!origen.value) {
            mostrarError(origen, 'Por favor complete el origen');
            isValid = false;
        }
        
        if (!destino.value) {
            mostrarError(destino, 'Por favor complete el destino');
            isValid = false;
        }
        
        // Validar que origen y destino no sean iguales
        if (origen.value && destino.value && origen.value.toLowerCase() === destino.value.toLowerCase()) {
            mostrarError(destino, 'El origen y el destino no pueden ser iguales');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Validar paso 3
    function validarPaso3() {
        let isValid = true;
        const pasajeros = document.getElementById('pasajeros');
        const telefono = document.getElementById('telefono');
        const email = document.getElementById('email');
        
        // Limpiar errores previos
        limpiarErroresPaso3();
        
        if (!pasajeros.value) {
            mostrarError(pasajeros, 'Por favor seleccione la cantidad de pasajeros');
            isValid = false;
        }
        
        if (!telefono.value) {
            mostrarError(telefono, 'Por favor complete el teléfono');
            isValid = false;
        }
        
        if (!email.value) {
            mostrarError(email, 'Por favor complete el email');
            isValid = false;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value && !emailRegex.test(email.value)) {
            mostrarError(email, 'Por favor ingrese un email válido');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Verificar si todos los pasos están completos
    function todosLosPasosCompletos() {
        // Limpiar todos los errores previos
        limpiarTodosLosErrores();
        
        const paso1Valido = validarPaso1();
        const paso2Valido = validarPaso2();
        const paso3Valido = validarPaso3();
        
        return paso1Valido && paso2Valido && paso3Valido;
    }
    
    // Agregar eventos a los botones "Siguiente"
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el número del siguiente paso
            const nextStep = this.getAttribute('data-next');
            const currentStep = this.closest('.form-step').getAttribute('data-step');
            
            // Validaciones específicas por paso
            let puedeAvanzar = true;
            
            if (currentStep === '1') {
                puedeAvanzar = validarPaso1();
            } else if (currentStep === '2') {
                puedeAvanzar = validarPaso2();
            }
            
            if (puedeAvanzar && nextStep) {
                showStep(nextStep);
            }
        });
    });
    
    // Agregar eventos a los botones "Anterior"
    prevButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el número del paso anterior
            const prevStep = this.getAttribute('data-prev');
            if (prevStep) {
                showStep(prevStep);
            }
        });
    });
    
    // Manejar el envío del formulario directamente
    const reserveButton = document.querySelector('button[type="submit"].btn-next');
    if (reserveButton && bookingForm) {
        reserveButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botón Reservar clickeado');
            
            // Verificar que todos los pasos estén completos
            if (!todosLosPasosCompletos()) {
                // Mostrar mensaje general de error
                mostrarErrorGeneral('Por favor complete todos los campos requeridos');
                return false;
            }
            
            // Rellenar campos ocultos
            rellenarCamposOcultos();
            
            // Obtener el código de reserva y email para pasarlos al popup
            const codigoReserva = document.getElementById('codigo_reserva').value;
            const emailCliente = document.getElementById('email').value;
            
            // Mostrar mensaje de confirmación
            mostrarMensajeExito('¡Reserva enviada correctamente!', codigoReserva, emailCliente);
            
            // Enviar el formulario
            bookingForm.submit();
        });
    }
    
    // Función para manejar el checkbox de equipaje
    function setupEquipajeCheckbox() {
        const equipajeCheckbox = document.getElementById('equipaje');
        const luggageDetails = document.getElementById('luggageDetails');
        
        if (equipajeCheckbox && luggageDetails) {
            equipajeCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    luggageDetails.classList.add('active');
                } else {
                    luggageDetails.classList.remove('active');
                }
            });
        }
    }
    
    // Función para rellenar campos ocultos
    function rellenarCamposOcultos() {
        // Obtener valores de los campos del formulario
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const origen = document.getElementById('origen').value;
        const destino = document.getElementById('destino').value;
        const pasajeros = document.getElementById('pasajeros').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const equipaje = document.getElementById('equipaje').checked;
        const maletas = document.getElementById('maletas').value;
        
        // Rellenar campos ocultos
        document.getElementById('fecha_hidden').value = fecha;
        document.getElementById('hora_hidden').value = hora;
        document.getElementById('origen_hidden').value = origen;
        document.getElementById('destino_hidden').value = destino;
        document.getElementById('pasajeros_hidden').value = pasajeros;
        document.getElementById('telefono_hidden').value = telefono;
        document.getElementById('email_cliente').value = email;
        document.getElementById('equipaje_hidden').value = equipaje ? 'Sí' : 'No';
        document.getElementById('maletas_hidden').value = equipaje ? maletas : '';
        
        // Generar código de reserva aleatorio (formato consistente con main.js)
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const codigoReserva = 'ALT-' + code;
        document.getElementById('codigo_reserva').value = codigoReserva;
    }
    
    // Función para mostrar error en un campo
    function mostrarError(campo, mensaje) {
        // Agregar clase de error al campo
        campo.classList.add('input-error');
        
        // Crear o actualizar mensaje de error
        let errorDiv = campo.parentNode.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message active';
            campo.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = mensaje;
        errorDiv.classList.add('active');
    }
    
    // Función para limpiar errores de un campo
    function limpiarError(campo) {
        if (!campo || !campo.parentNode) return;
        
        campo.classList.remove('input-error');
        const errorDiv = campo.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.classList.remove('active');
            // Opcionalmente podemos remover el elemento si ya no tiene contenido
            // errorDiv.remove();
        }
        
        // Limpiar la marca de aeropuerto seleccionado si existe
        if (campo.dataset.airportSelected) {
            campo.dataset.airportSelected = 'false';
            delete campo.dataset.selectedAirportName;
        }
    }
    
    // Funciones para limpiar errores por paso
    function limpiarErroresPaso1() {
        limpiarError(document.getElementById('fecha'));
        limpiarError(document.getElementById('hora'));
    }
    
    function limpiarErroresPaso2() {
        limpiarError(document.getElementById('origen'));
        limpiarError(document.getElementById('destino'));
    }
    
    function limpiarErroresPaso3() {
        limpiarError(document.getElementById('pasajeros'));
        limpiarError(document.getElementById('telefono'));
        limpiarError(document.getElementById('email'));
    }
    
    // Función para limpiar todos los errores
    function limpiarTodosLosErrores() {
        limpiarErroresPaso1();
        limpiarErroresPaso2();
        limpiarErroresPaso3();
        
        // Limpiar mensaje de error general si existe
        const mensajeError = document.getElementById('formulario-error');
        if (mensajeError) {
            mensajeError.style.display = 'none';
        }
        
        // Limpiar mensaje de éxito si existe
        const mensajeExito = document.getElementById('formulario-exito');
        if (mensajeExito) {
            mensajeExito.style.display = 'none';
        }
    }
    
    // Función para mostrar mensaje de error general
    function mostrarErrorGeneral(mensaje) {
        // Crear contenedor de mensajes si no existe
        let contenedorMensajes = document.getElementById('mensajes-formulario');
        if (!contenedorMensajes) {
            contenedorMensajes = document.createElement('div');
            contenedorMensajes.id = 'mensajes-formulario';
            contenedorMensajes.style.marginBottom = '20px';
            document.querySelector('.booking-form').insertBefore(contenedorMensajes, document.querySelector('.booking-form').firstChild);
        }
        
        // Crear o actualizar mensaje de error
        let mensajeError = document.getElementById('formulario-error');
        if (!mensajeError) {
            mensajeError = document.createElement('div');
            mensajeError.id = 'formulario-error';
            mensajeError.style.color = '#ef4444';
            mensajeError.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            mensajeError.style.padding = '10px';
            mensajeError.style.borderRadius = '5px';
            mensajeError.style.marginBottom = '15px';
            contenedorMensajes.appendChild(mensajeError);
        }
        
        mensajeError.textContent = mensaje;
        mensajeError.style.display = 'block';
    }
    
    // Función para mostrar mensaje de éxito
    function mostrarMensajeExito(mensaje, codigoReserva, emailCliente) {
        // Si se proporcionan código de reserva y email, mostrar el popup
        if (codigoReserva && emailCliente) {
            // Llamar a la función showReservationPopup que está en main.js
            if (typeof showReservationPopup === 'function') {
                showReservationPopup(codigoReserva, emailCliente);
            } else {
                // Fallback: mostrar mensaje estático si la función no está disponible
                mostrarMensajeExitoEstatico(mensaje);
            }
        } else {
            // Mostrar mensaje estático si no se proporcionan los datos
            mostrarMensajeExitoEstatico(mensaje);
        }
    }
    
    // Función para mostrar mensaje de éxito estático (versión original)
    function mostrarMensajeExitoEstatico(mensaje) {
        // Crear contenedor de mensajes si no existe
        let contenedorMensajes = document.getElementById('mensajes-formulario');
        if (!contenedorMensajes) {
            contenedorMensajes = document.createElement('div');
            contenedorMensajes.id = 'mensajes-formulario';
            contenedorMensajes.style.marginBottom = '20px';
            document.querySelector('.booking-form').insertBefore(contenedorMensajes, document.querySelector('.booking-form').firstChild);
        }
        
        // Crear o actualizar mensaje de éxito
        let mensajeExito = document.getElementById('formulario-exito');
        if (!mensajeExito) {
            mensajeExito = document.createElement('div');
            mensajeExito.id = 'formulario-exito';
            mensajeExito.style.color = '#22c55e';
            mensajeExito.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
            mensajeExito.style.padding = '10px';
            mensajeExito.style.borderRadius = '5px';
            mensajeExito.style.marginBottom = '15px';
            contenedorMensajes.appendChild(mensajeExito);
        }
        
        mensajeExito.textContent = mensaje;
        mensajeExito.style.display = 'block';
    }
    
    // Función para configurar la limpieza de errores al interactuar con los campos
    function setupLimpiadoDeErrores() {
        // Campos del paso 1
        const fecha = document.getElementById('fecha');
        const hora = document.getElementById('hora');
        
        if (fecha) {
            fecha.addEventListener('input', function() {
                limpiarError(this);
            });
        }
        
        if (hora) {
            hora.addEventListener('input', function() {
                limpiarError(this);
            });
        }
        
        // Campos del paso 2
        const origen = document.getElementById('origen');
        const destino = document.getElementById('destino');
        
        if (origen) {
            origen.addEventListener('input', function() {
                limpiarError(this);
            });
        }
        
        if (destino) {
            destino.addEventListener('input', function() {
                limpiarError(this);
            });
        }
        
        // Campos del paso 3
        const pasajeros = document.getElementById('pasajeros');
        const telefono = document.getElementById('telefono');
        const email = document.getElementById('email');
        
        if (pasajeros) {
            pasajeros.addEventListener('change', function() {
                limpiarError(this);
            });
        }
        
        if (telefono) {
            telefono.addEventListener('input', function() {
                limpiarError(this);
            });
        }
        
        if (email) {
            email.addEventListener('input', function() {
                limpiarError(this);
            });
        }
    }
    
    // Inicializar el formulario
    cargarZonas();
    setupEquipajeCheckbox();
    setupLimpiadoDeErrores();
    showStep(1);

    // ---------- CONFIG -----------------------------------------------------------------
    const GEOAPIFY_API_KEY = '1186162aedfa4b10adf6713a6dcf05e1'; // API key de Geoapify
    const LOCATIONIQ_API_KEY = 'pk.7db488523e6dd38920e7f17a763bc4aa'; // API key de LocationIQ
    const BBOX = { lonMin: -59.30, latMin: -35.00, lonMax: -57.50, latMax: -34.20 };
    const AUTOCOMPLETE_LIMIT = 15; // Aumentado a 15 resultados
    const DEBOUNCE_MS = 260;
    // -------------------------------------------------------------------------------------

    // Helpers
    function debounce(fn, wait){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), wait); }}

    function isInsideBBox(lon, lat){
        return lon >= BBOX.lonMin && lon <= BBOX.lonMax && lat >= BBOX.latMin && lat <= BBOX.latMax;
    }

    function haversine(lat1, lon1, lat2, lon2){
        const toRad = v => v * Math.PI / 180;
        const R = 6371; // km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    // Función para construir direcciones bien formateadas
    function buildAddress(place) {
        const address = place.address;
        if (!address) return place.display_name || '';
        
        return [
            `${address.road || ''} ${address.house_number || ''}`.trim(),
            address.postcode,
            address.suburb || address.city || address.town,
            address.state
        ].filter(Boolean).join(', ');
    }
// Función para obtener sugerencias de LocationIQ
    async function getLocationIQSuggestions(query) {
        if (!query || query.length < 3) {
            console.log('Consulta demasiado corta:', query.length);
            return [];
        }
        
        try {
            console.log('Buscando sugerencias en LocationIQ para:', query);
            
            const url = `https://api.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&viewbox=${BBOX.lonMin},${BBOX.latMin},${BBOX.lonMax},${BBOX.latMax}&bounded=1&countrycodes=ar&limit=${AUTOCOMPLETE_LIMIT}&accept-language=es&format=json`;
            
            const response = await fetch(url);
            const data = await response.json();
            console.log('Respuesta de LocationIQ:', data);
            
            if (Array.isArray(data)) {
                console.log('Total de resultados:', data.length);
                
                const queryLower = query.toLowerCase().trim();
                const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);
                
                const validResults = data.filter((place, index) => {
                    const lon = parseFloat(place.lon);
                    const lat = parseFloat(place.lat);
                    
                    // 1. Validar bounding box
                    if (!isInsideBBox(lon, lat)) {
                        console.log(`Excluyendo resultado ${index + 1}: Fuera del bounding box`);
                        return false;
                    }
                    
                    // 2. Construir la dirección principal (calle + número)
                    const road = (place.address?.road || '').toLowerCase().trim();
                    const houseNumber = (place.address?.house_number || '').toLowerCase().trim();
                    const streetAddress = `${road} ${houseNumber}`.trim();
                    const displayNameLower = place.display_name.toLowerCase();
                    
                    console.log(`Evaluando resultado ${index + 1}:`, {
                        display_name: place.display_name,
                        street: road,
                        number: houseNumber,
                        streetAddress: streetAddress
                    });
                    
                    // 3. VALIDACIÓN ESTRICTA: La consulta debe aparecer como frase continua
                    // Verificar si la consulta completa aparece en la dirección
                    const queryInStreetAddress = streetAddress.includes(queryLower);
                    const queryInDisplayName = displayNameLower.includes(queryLower);
                    
                    if (queryInStreetAddress || queryInDisplayName) {
                        console.log(`✓ Resultado ${index + 1} VÁLIDO: Contiene la frase completa "${queryLower}"`);
                        return true;
                    }
                    
                    // 4. VALIDACIÓN ALTERNATIVA: Verificar orden y proximidad de las palabras
                    // Solo si la búsqueda tiene 2 o más palabras
                    if (queryWords.length >= 2) {
                        // Encontrar la posición de cada palabra en la dirección
                        const positions = queryWords.map(word => {
                            // Normalizar las palabras quitando tildes para comparación
                            const normalizedWord = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                            const normalizedStreet = streetAddress.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                            const normalizedDisplay = displayNameLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                            
                            const posInStreet = normalizedStreet.indexOf(normalizedWord);
                            const posInDisplay = normalizedDisplay.indexOf(normalizedWord);
                            
                            // Retornar la primera posición encontrada
                            if (posInStreet !== -1) return { pos: posInStreet, found: true };
                            if (posInDisplay !== -1) return { pos: posInDisplay, found: true };
                            return { pos: -1, found: false };
                        });
                        
                        // Verificar que TODAS las palabras fueron encontradas
                        const allWordsFound = positions.every(p => p.found);
                        
                        if (!allWordsFound) {
                            console.log(`Excluyendo resultado ${index + 1}: No contiene todas las palabras de la búsqueda`);
                            return false;
                        }
                        
                        // Verificar que las palabras están en el MISMO ORDEN
                        let inOrder = true;
                        for (let i = 1; i < positions.length; i++) {
                            if (positions[i].pos <= positions[i - 1].pos) {
                                inOrder = false;
                                break;
                            }
                        }
                        
                        if (!inOrder) {
                            console.log(`Excluyendo resultado ${index + 1}: Las palabras no están en el mismo orden`);
                            return false;
                        }
                        
                        // Verificar PROXIMIDAD: las palabras deben estar cerca (máximo 20 caracteres de distancia)
                        // Aumentamos la distancia para permitir direcciones más largas
                        const MAX_DISTANCE = 20;
                        for (let i = 1; i < positions.length; i++) {
                            const distance = positions[i].pos - positions[i - 1].pos - queryWords[i - 1].length;
                            if (distance > MAX_DISTANCE) {
                                console.log(`Excluyendo resultado ${index + 1}: Las palabras están muy separadas (distancia: ${distance})`);
                                return false;
                            }
                        }
                        
                        console.log(`✓ Resultado ${index + 1} VÁLIDO: Palabras en orden y cercanas`);
                        return true;
                    }
                    
                    // 5. Para búsquedas de una sola palabra, verificar que existe
                    if (queryWords.length === 1) {
                        const wordFound = streetAddress.includes(queryWords[0]) || displayNameLower.includes(queryWords[0]);
                        if (wordFound) {
                            console.log(`✓ Resultado ${index + 1} VÁLIDO: Contiene la palabra "${queryWords[0]}"`);
                            return true;
                        }
                    }
                    
                    console.log(`Excluyendo resultado ${index + 1}: No cumple criterios de relevancia`);
                    return false;
                });
                
                console.log('Resultados válidos después del filtrado estricto:', validResults.length);
                
                // Verificación adicional del área geográfica
                const finalResults = validResults.filter((place, index) => {
                    // Verificar si es una dirección válida de Buenos Aires Capital o Gran Buenos Aires
                    const isAreaValid = 
                        // Direcciones de Buenos Aires Capital
                        (place.address?.state === 'Buenos Aires' && place.address?.city === 'Buenos Aires') ||
                        place.address?.state === 'Ciudad Autónoma de Buenos Aires' ||
                        place.address?.state_district === 'Ciudad Autónoma de Buenos Aires' ||
                        // También permitir direcciones donde solo se especifica la ciudad
                        place.address?.city === 'Buenos Aires' ||
                        place.address?.city === 'Ciudad Autónoma de Buenos Aires' ||
                        // Permitir direcciones del Gran Buenos Aires
                        (place.address?.state === 'Buenos Aires' && [
                            'Caseros', 'Villa Ballester', 'San Martín', 'Vicente López', 'Olivos', 
                            'San Isidro', 'Boulogne', 'Tigre', 'Pacheco', 'Don Torcuato', 
                            'Grand Bourg', 'Benavídez', 'Milberg', 'Tortuguitas', 'Ingeniero Maschwitz', 
                            'Del Viso', 'Pilar', 'Escobar', 'Campana', 'Cardales', 
                            'José León Suárez', 'General San Martín', 'Partido de General San Martín',
                            'Avellaneda', 'Lanús', 'Wilde', 'Monte Chingolo', 'Quilmes', 
                            'Almirante Brown', 'Berazategui', 'Hudson', 'Lomas de Zamora', 
                            'Canning', 'Spegazzini', 'La Plata', 'Ramos Mejía', 'Ciudadela', 
                            'Morón', 'Haedo', 'Caseros', 'El Palomar', 'Hurlingham', 
                            'Loma Hermosa', 'Ituzaingó', 'Padua', 'San Miguel', 'José C. Paz', 
                            'Merlo', 'Paso del Rey', 'Moreno', 'Francisco Álvarez', 
                            'General Rodríguez', 'Luján'
                        ].includes(place.address?.city)) ||
                        // Permitir direcciones del partido de Buenos Aires
                        place.address?.state === 'Buenos Aires';
                    
                    if (!isAreaValid) {
                        console.log(`Excluyendo resultado por área geográfica:`, place.display_name);
                        return false;
                    }
                    
                    return true;
                });
                
                console.log('Resultados finales válidos:', finalResults.length);
                
                // Convertir resultados al formato consistente
                const convertedResults = finalResults.map(place => ({
                    properties: {
                        formatted: place.display_name,
                        housenumber: place.address?.house_number || '',
                        street: place.address?.road || place.address?.pedestrian || '',
                        city: place.address?.city || place.address?.town || place.address?.village || '',
                        suburb: place.address?.suburb || '',
                        district: place.address?.district || '',
                        county: place.address?.county || '',
                        postcode: place.address?.postcode || '',
                        name: place.address?.road || place.display_name,
                        state: place.address?.state || '',
                        state_district: place.address?.state_district || ''
                    },
                    geometry: {
                        coordinates: [parseFloat(place.lon), parseFloat(place.lat)]
                    }
                }));
                
                return convertedResults.slice(0, AUTOCOMPLETE_LIMIT);
            }
            
            return [];
        } catch (error) {
            console.error('Error obteniendo sugerencias de LocationIQ:', error);
            return [];
        }
    }
    
    // Función para obtener sugerencias de Geoapify cumpliendo reglas estrictas
    async function getGeoapifySuggestions(query) {
        if (!query || query.length < 3) {
            console.log('Consulta demasiado corta:', query.length);
            return [];
        }
        
        try {
            console.log('Buscando sugerencias para:', query);
            
            // Construir la URL de la API de Geoapify con bias (NO filter)
            // Usar bias, NO filter según las reglas
            // No especificar type para permitir todos los tipos de resultados
            const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&bias=rect:${BBOX.lonMin},${BBOX.latMin},${BBOX.lonMax},${BBOX.latMax}&limit=${AUTOCOMPLETE_LIMIT}&lang=es&apiKey=${GEOAPIFY_API_KEY}`;
            
            const response = await fetch(url);
            const data = await response.json();
            console.log('Respuesta de Geoapify:', data);
            
            // Procesar resultados sin filtrar por ciudad, suburbio, etc.
            if (data.features) {
                console.log('Total de resultados:', data.features.length);
                
                // Mostrar información detallada de cada resultado para diagnóstico
                data.features.forEach((feature, index) => {
                    const address = feature.properties;
                    const geometry = feature.geometry;
                    
                    console.log(`Resultado ${index + 1}:`, {
                        formatted: address.formatted,
                        lat: geometry.coordinates[1],
                        lon: geometry.coordinates[0],
                        city: address.city,
                        suburb: address.suburb,
                        district: address.district,
                        postcode: address.postcode,
                        street: address.street,
                        housenumber: address.housenumber
                    });
                });
                
                // Validar coordenadas de cada resultado
                const validResults = data.features.filter((feature, index) => {
                    const geometry = feature.geometry;
                    const lon = geometry.coordinates[0];
                    const lat = geometry.coordinates[1];
                    
                    // Validar obligatoriamente que esté dentro del bounding box
                    const isValid = isInsideBBox(lon, lat);
                    
                    console.log(`Validando resultado ${index + 1}: Coordenadas (${lat}, ${lon}) - Válido: ${isValid}`);
                    
                    return isValid;
                });
                
                console.log('Resultados válidos dentro del área permitida:', validResults.length);
                
                // Limitar a AUTOCOMPLETE_LIMIT resultados válidos
                const limitedResults = validResults.slice(0, AUTOCOMPLETE_LIMIT);
                
                // Procesar las sugerencias para mostrar información más útil
                const processedSuggestions = limitedResults.map(feature => {
                    const address = feature.properties;
                    console.log('Procesando resultado válido:', address);
                    return feature;
                });
                
                return processedSuggestions;
            }
            
            return [];
        } catch (error) {
            console.error('Error obteniendo sugerencias de Geoapify:', error);
            return [];
        }
    }
    

    

    



});