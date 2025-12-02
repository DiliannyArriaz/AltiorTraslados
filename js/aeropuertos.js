// Aeropuertos disponibles
const AEROPUERTOS = [
    { nombre: "Aeropuerto Ezeiza", direccion: "Aeropuerto Internacional Ministro Pistarini, Ezeiza, Buenos Aires" },
    { nombre: "Aeropuerto Aeroparque", direccion: "Aeropuerto Jorge Newbery, Ciudad Autónoma de Buenos Aires" }
];

// Función para seleccionar un aeropuerto
function selectAirport(airport, inputElement) {
    // Usar el nombre del aeropuerto para el input
    inputElement.value = airport.nombre;
    // Encontrar el contenedor de sugerencias asociado a este input
    const suggestionsContainer = inputElement.parentNode.querySelector('.autocomplete-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
        suggestionsContainer.innerHTML = '';
    }
    
    // Disparar evento input para actualizar validaciones
    inputElement.dispatchEvent(new Event('input'));
}

// Función para configurar el autocompletado de aeropuertos
function setupAirportAutocomplete(inputId, suggestionsId) {
    console.log(`Setting up airport autocomplete for ${inputId}`);
    
    const input = document.getElementById(inputId);
    if (!input) {
        console.error(`Input with id ${inputId} not found`);
        return;
    }
    
    console.log(`Found input for ${inputId}:`, input);
    
    let suggestionsContainer = document.getElementById(suggestionsId);
    let debounceTimer;
    
    // Crear contenedor de sugerencias si no existe
    if (!suggestionsContainer) {
        console.log(`Creating suggestions container for ${inputId}`);
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = suggestionsId;
        suggestionsContainer.className = 'autocomplete-suggestions';
        suggestionsContainer.style.cssText = `
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
        input.parentNode.appendChild(suggestionsContainer);
        console.log(`Created suggestions container for ${inputId}:`, suggestionsContainer);
    } else {
        console.log(`Found existing suggestions container for ${inputId}:`, suggestionsContainer);
    }

    // Función para seleccionar un aeropuerto
    input.addEventListener('input', function () {
        console.log(`Input event triggered for ${inputId}:`, this.value);
        const query = this.value.toLowerCase();
        console.log(`Query for ${inputId}:`, query);

        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';

        // Para consultas muy cortas, no buscar
        if (query.length < 2) {
            console.log(`Query too short for ${inputId}:`, query.length);
            suggestionsContainer.style.display = 'none';
            return;
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            // Siempre mostrar sugerencias de aeropuertos para el campo de destino
            // cuando el origen no es un aeropuerto
            if (inputId === 'destino') {
                const origenInput = document.getElementById('origen');
                if (origenInput) {
                    const origenValue = origenInput.value.toLowerCase();
                    const isOrigenAirport = origenValue.includes('ezeiza') || origenValue.includes('aeroparque');
                    
                    // Si el origen no es aeropuerto, mostrar siempre sugerencias de aeropuertos
                    if (!isOrigenAirport && query.length >= 2) {
                        displayAirportSuggestions(AEROPUERTOS, suggestionsContainer, input);
                        return;
                    }
                }
            }
            
            // Para el campo de origen o cuando el origen es aeropuerto, 
            // mostrar sugerencias basadas en la consulta
            const matchingAirports = AEROPUERTOS.filter(airport => 
                airport.nombre.toLowerCase().includes(query)
            );

            console.log('Matching airports:', matchingAirports);

            // Mostrar resultados
            if (matchingAirports.length > 0) {
                displayAirportSuggestions(matchingAirports, suggestionsContainer, input);
            } else {
                // Si no hay resultados, verificar si es una dirección
                if (query.length >= 4) {
                    // Es una dirección, no mostrar sugerencias de aeropuertos
                    suggestionsContainer.style.display = 'none';
                }
            }
        }, 300);
    });

    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (e.target !== input && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Cerrar sugerencias con Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
        }
    });
}

// Función para mostrar sugerencias de aeropuertos
function displayAirportSuggestions(airports, suggestionsContainer, input) {
    suggestionsContainer.innerHTML = '';
    
    if (airports.length > 0) {
        suggestionsContainer.style.display = 'block';
        
        airports.forEach(airport => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                font-size: 0.9em;
                display: flex;
                align-items: center;
            `;
            
            div.innerHTML = `<strong>${airport.nombre}</strong>`;
            
            // Evento mouseenter para escritorio
            div.addEventListener('mouseenter', function () {
                this.style.backgroundColor = '#f5f8fc';
            });
            
            // Evento mouseleave para escritorio
            div.addEventListener('mouseleave', function () {
                this.style.backgroundColor = 'white';
            });
            
            // Evento click para escritorio
            div.addEventListener('click', function () {
                selectAirport(airport, input);
            });
            
            // Evento touch para móviles
            div.addEventListener('touchstart', function () {
                selectAirport(airport, input);
            });
            
            suggestionsContainer.appendChild(div);
        });
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// Función para validar que el destino sea un aeropuerto si el origen es una dirección
function validateDestination() {
    const origenInput = document.getElementById('origen');
    const destinoInput = document.getElementById('destino');
    const destinoError = document.getElementById('destino-error');
    const destinoSuggestions = document.getElementById('destino-suggestions');
    
    if (!origenInput || !destinoInput || !destinoError) return;
    
    const origenValue = origenInput.value.toLowerCase();
    const destinoValue = destinoInput.value.toLowerCase();
    
    // Verificar si el origen es una dirección (no es un aeropuerto)
    const isOrigenAirport = origenValue.includes('ezeiza') || origenValue.includes('aeroparque');
    
    if (!isOrigenAirport && destinoValue.trim() !== '') {
        // Si el origen no es aeropuerto, el destino debe ser un aeropuerto
        const isDestinoAirport = destinoValue.includes('ezeiza') || destinoValue.includes('aeroparque');
        
        if (!isDestinoAirport) {
            // Mostrar error
            destinoError.style.display = 'block';
            // Mostrar sugerencias de aeropuertos después de 2 segundos para que el usuario pueda leer el mensaje de error
            if (destinoValue.length >= 2) {
                // Limpiar cualquier timeout previo
                if (destinoInput.delayTimeout) {
                    clearTimeout(destinoInput.delayTimeout);
                }
                
                // Configurar un nuevo timeout de 2 segundos
                destinoInput.delayTimeout = setTimeout(() => {
                    displayAirportSuggestions(AEROPUERTOS, destinoSuggestions, destinoInput);
                }, 2000);
            }
        } else {
            // Si es un aeropuerto válido, cancelar cualquier timeout pendiente y ocultar sugerencias
            if (destinoInput.delayTimeout) {
                clearTimeout(destinoInput.delayTimeout);
                destinoInput.delayTimeout = null;
            }
            destinoError.style.display = 'none';
            destinoSuggestions.style.display = 'none';
        }
    } else {
        // Si el origen es aeropuerto o el destino está vacío, cancelar cualquier timeout pendiente
        if (destinoInput.delayTimeout) {
            clearTimeout(destinoInput.delayTimeout);
            destinoInput.delayTimeout = null;
        }
        destinoError.style.display = 'none';
        // Solo ocultar sugerencias si no hay consulta
        if (destinoValue.trim() === '') {
            destinoSuggestions.style.display = 'none';
        }
    }
}

// Inicializar autocompletado cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar autocompletado para ambos campos
    setupAirportAutocomplete('origen', 'origen-suggestions');
    setupAirportAutocomplete('destino', 'destino-suggestions');
    
    // Agregar validación en tiempo real
    const origenInput = document.getElementById('origen');
    const destinoInput = document.getElementById('destino');
    
    if (origenInput) {
        origenInput.addEventListener('input', validateDestination);
    }
    
    if (destinoInput) {
        destinoInput.addEventListener('input', validateDestination);
    }
});