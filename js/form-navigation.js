// Script para manejar la navegación entre pasos del formulario
document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los botones de navegación
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const formSteps = document.querySelectorAll('.form-step');
    const bookingForm = document.getElementById('bookingForm');
    
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
        const zona = document.getElementById('zona');
        const origen = document.getElementById('origen');
        const destino = document.getElementById('destino');
        
        // Limpiar errores previos
        limpiarErroresPaso2();
        
        if (!zona.value) {
            mostrarError(zona, 'Por favor seleccione una zona');
            isValid = false;
        }
        
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
        const zona = document.getElementById('zona').value;
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
        document.getElementById('zona_hidden').value = zona;
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
        if (!campo) return;
        
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
        limpiarError(document.getElementById('zona'));
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
        const zona = document.getElementById('zona');
        const origen = document.getElementById('origen');
        const destino = document.getElementById('destino');
        
        if (zona) {
            zona.addEventListener('change', function() {
                limpiarError(this);
            });
        }
        
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
});