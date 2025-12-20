// Mapa de zonas a regiones más generales para búsqueda
const zonaToRegion = {
    'CABA': 'Ciudad Autónoma de Buenos Aires',
    'Avellaneda / Lanús': 'Gran Buenos Aires',
    'Wilde / Monte Chingolo': 'Gran Buenos Aires',
    'Quilmes / Alte Brown': 'Gran Buenos Aires',
    'Berazategui / Hudson': 'Gran Buenos Aires',
    'Lomas de Zamora': 'Gran Buenos Aires',
    'Canning / Spegazzini': 'Gran Buenos Aires',
    'La Plata': 'Gran Buenos Aires',
    'Ramos Mejía / Ciudadela': 'Gran Buenos Aires',
    'Morón / Haedo': 'Gran Buenos Aires',
    'Caseros / El Palomar': 'Gran Buenos Aires',
    'Hurlingham / Loma Hermosa': 'Gran Buenos Aires',
    'Ituzaingó / Padua': 'Gran Buenos Aires',
    'San Miguel / José C. Paz': 'Gran Buenos Aires',
    'Merlo / Paso del Rey': 'Gran Buenos Aires',
    'Moreno / Francisco Álvarez': 'Gran Buenos Aires',
    'Gral. Rodríguez': 'Gran Buenos Aires',
    'Luján': 'Gran Buenos Aires',
    'Vicente López / Olivos': 'Gran Buenos Aires',
    'San Martín / San Andrés': 'Gran Buenos Aires',
    'San Isidro / Boulogne': 'Gran Buenos Aires',
    'Villa Ballester / José León Suárez': 'Gran Buenos Aires',
    'Tigre Centro / Pacheco': 'Gran Buenos Aires',
    'Don Torcuato / Grand Bourg': 'Gran Buenos Aires',
    'Benavídez / Milberg / Tortuguitas': 'Gran Buenos Aires',
    'Ing. Maschwitz / Del Viso': 'Gran Buenos Aires',
    'Pilar / Escobar': 'Gran Buenos Aires',
    'Campana / Cardales': 'Gran Buenos Aires'
};

// Mapa de regiones a ubicaciones geográficas para filtrar búsquedas
const regionToLocations = {
    'Ciudad Autónoma de Buenos Aires': ['Buenos Aires', 'Ciudad Autónoma de Buenos Aires'],
    'Gran Buenos Aires': [
        'Buenos Aires', 'Ciudad Autónoma de Buenos Aires',
        'San Martín', 'Vicente López', 'Olivos', 'San Isidro', 'Boulogne', 'Tigre', 'Pacheco', 
        'Don Torcuato', 'Grand Bourg', 'Benavídez', 'Milberg', 'Tortuguitas', 'Ingeniero Maschwitz', 
        'Del Viso', 'Pilar', 'Escobar', 'Campana', 'Cardales', 'José León Suárez', 'Villa Ballester',
        'Villa General Tomás Guido', 'General San Martín', 'Partido de General San Martín',
        'Avellaneda', 'Lanús', 'Wilde', 'Monte Chingolo', 'Quilmes', 'Almirante Brown', 
        'Berazategui', 'Hudson', 'Lomas de Zamora', 'Canning', 'Spegazzini', 'La Plata',
        'Ramos Mejía', 'Ciudadela', 'Morón', 'Haedo', 'Caseros', 'El Palomar', 'Hurlingham', 
        'Loma Hermosa', 'Ituzaingó', 'Padua', 'San Miguel', 'José C. Paz', 'Merlo', 
        'Paso del Rey', 'Moreno', 'Francisco Álvarez', 'General Rodríguez', 'Luján'
    ]
};

// Códigos postales específicos por región
const regionPostalCodes = {
    'Ciudad Autónoma de Buenos Aires': [],
    'Gran Buenos Aires': []
};

// Función para obtener sugerencias de Geoapify
async function getSuggestions(query, zone) {
    if (!query || query.length < 3) {
        console.log('Consulta demasiado corta:', query.length);
        return [];
    }
    
    try {
        console.log('Buscando sugerencias para:', query);
        
        // Construir la URL de la API de Geoapify con parámetros más amplios
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&filter=countrycode:ar&lang=es&limit=30&apiKey=1186162aedfa4b10adf6713a6dcf05e1`;
        
        const response = await fetch(url);
        const data = await response.json();
        console.log('Respuesta de Geoapify:', data);
        
        // Mostrar todas las sugerencias sin filtrar para diagnóstico
        if (data.features) {
            console.log('Total de resultados:', data.features.length);
            
            // Mostrar información detallada de cada resultado para diagnóstico
            data.features.forEach((feature, index) => {
                const address = feature.properties;
                console.log(`Resultado ${index + 1}:`, {
                    formatted: address.formatted,
                    city: address.city,
                    state: address.state,
                    suburb: address.suburb,
                    postcode: address.postcode,
                    district: address.district,
                    street: address.street,
                    housenumber: address.housenumber
                });
            });
            
            // Buscar resultados que coincidan con códigos postales de interés (1653, B1653)
            const postalCodeResults = data.features.filter((feature, index) => {
                const address = feature.properties;
                const formatted = address.formatted || '';
                const postcode = address.postcode || '';
                
                // Buscar coincidencias con códigos postales específicos
                const hasPostalCode1653 = postcode.includes('1653') || postcode.includes('B1653');
                
                console.log(`Verificando resultado ${index + 1}: CP1653=${hasPostalCode1653}`, {formatted, postcode});
                
                return hasPostalCode1653;
            });
            
            console.log('Resultados con código postal 1653 encontrados:', postalCodeResults.length);
            
            // Si encontramos resultados con código postal relevante, mostrar solo esos
            if (postalCodeResults.length > 0) {
                // Limitar a 10 resultados con código postal
                const limitedResults = postalCodeResults.slice(0, 10);
                
                // Procesar las sugerencias para mostrar información más útil
                const processedSuggestions = limitedResults.map(feature => {
                    const address = feature.properties;
                    console.log('Procesando resultado con código postal:', address);
                    return feature;
                });
                
                return processedSuggestions;
            }
            
            // Buscar resultados específicos que coincidan con la consulta
            const specificResults = data.features.filter((feature, index) => {
                const address = feature.properties;
                const formatted = address.formatted || '';
                const street = address.street || '';
                const housenumber = address.housenumber || '';
                
                // Buscar coincidencias con la consulta
                const queryLower = query.toLowerCase();
                const hasQuery = formatted.toLowerCase().includes(queryLower) || 
                                street.toLowerCase().includes(queryLower) || 
                                housenumber.includes(query.replace(/\D/g, ''));
                
                console.log(`Verificando resultado ${index + 1}: Query=${hasQuery}`, {formatted, street, housenumber});
                
                return hasQuery;
            });
            
            console.log('Resultados específicos encontrados:', specificResults.length);
            
            // Si encontramos resultados específicos, mostrar solo esos
            if (specificResults.length > 0) {
                // Limitar a 10 resultados específicos
                const limitedResults = specificResults.slice(0, 10);
                
                // Procesar las sugerencias para mostrar información más útil
                const processedSuggestions = limitedResults.map(feature => {
                    const address = feature.properties;
                    console.log('Procesando resultado específico:', address);
                    return feature;
                });
                
                return processedSuggestions;
            }
            
            // Si no hay resultados específicos, mostrar los primeros 10 resultados generales
            const limitedResults = data.features.slice(0, 10);
            
            // Procesar las sugerencias para mostrar información más útil
            const processedSuggestions = limitedResults.map(feature => {
                const address = feature.properties;
                console.log('Procesando feature general:', address);
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

// Función para mostrar sugerencias
function showSuggestions(suggestions, container, input) {
    console.log('Mostrando', suggestions.length, 'sugerencias');
    container.innerHTML = '';
    
    if (suggestions.length === 0) {
        container.style.display = 'none';
        console.log('No hay sugerencias para mostrar');
        return;
    }
    
    suggestions.forEach((suggestion, index) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        
        const address = suggestion.properties;
        
        // Mostrar información de depuración detallada
        console.log(`Sugerencia ${index + 1}:`, address);
        
        // Extraer información más detallada
        const name = address.name || address.street || 'Dirección';
        const houseNumber = address.housenumber || '';
        const street = address.street || '';
        const city = address.city || '';
        const state = address.state || '';
        const postcode = address.postcode || '';
        const suburb = address.suburb || '';
        
        // Construir un nombre más descriptivo
        let displayName = name;
        if (houseNumber && street && !name.includes(houseNumber)) {
            displayName = `${houseNumber} ${street}`;
        }
        
        // Construir detalles más completos
        const detailsParts = [];
        if (houseNumber && street && !displayName.includes(houseNumber)) {
            detailsParts.push(`${houseNumber} ${street}`);
        } else if (street && !displayName.includes(street)) {
            detailsParts.push(street);
        }
        
        if (suburb && !displayName.includes(suburb)) {
            detailsParts.push(suburb);
        }
        
        if (city && !displayName.includes(city)) {
            detailsParts.push(city);
        }
        
        if (state && !displayName.includes(state)) {
            detailsParts.push(state);
        }
        
        if (postcode && !displayName.includes(postcode)) {
            detailsParts.push(postcode);
        }
        
        const displayDetails = detailsParts.join(', ');
        
        div.innerHTML = `
            <div class="suggestion-name">${displayName}</div>
            ${displayDetails ? `<div class="suggestion-details">${displayDetails}</div>` : ''}
        `;
        
        div.addEventListener('click', () => {
            input.value = displayName;
            // Guardar la dirección completa en un atributo de datos
            const fullAddress = [houseNumber, street, suburb, city, state, postcode].filter(Boolean).join(', ');
            input.setAttribute('data-full-address', fullAddress);
            container.style.display = 'none';
            
            // Disparar evento input para validar
            input.dispatchEvent(new Event('input'));
            console.log('Seleccionada sugerencia:', displayName);
        });
        
        container.appendChild(div);
        console.log(`Agregada sugerencia ${index + 1}:`, displayName, '| Detalles:', displayDetails);
    });
    
    container.style.display = 'block';
    console.log('Contenedor de sugerencias mostrado con estilo:', container.style.display);
    console.log('Contenedor de sugerencias:', container);
    console.log('Posición del contenedor:', container.getBoundingClientRect());
}

// Inicializar autocompletado
function initAutocomplete() {
    console.log('Inicializando sistema de autocompletado de prueba');
    
    // Verificar que los elementos existan
    const zonaSelect = document.getElementById('zona');
    const direccionInput = document.getElementById('direccion');
    
    if (!zonaSelect || !direccionInput) {
        console.log('No se encontraron los elementos necesarios para el autocompletado');
        return;
    }
    
    console.log('Elementos encontrados, configurando autocompletado...');
    
    // Crear contenedor para sugerencias si no existe
    let suggestionsContainer = document.getElementById('direccion-suggestions');
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'direccion-suggestions';
        suggestionsContainer.className = 'suggestions-container';
        direccionInput.parentNode.appendChild(suggestionsContainer);
        console.log('Contenedor de sugerencias creado');
    } else {
        console.log('Contenedor de sugerencias ya existe');
    }
    
    // Variables para manejar el debounce
    let debounceTimer;
    
    // Event listener para el input
    direccionInput.addEventListener('input', function() {
        const query = this.value.trim();
        const selectedZone = zonaSelect.value;
        
        console.log('Input event:', query, 'zona seleccionada:', selectedZone);
        
        // Limpiar timer anterior
        clearTimeout(debounceTimer);
        
        // Ocultar sugerencias si no hay consulta
        if (!query) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Esperar 300ms antes de buscar sugerencias
        debounceTimer = setTimeout(async () => {
            if (selectedZone && query.length >= 3) {
                console.log('Buscando sugerencias...');
                const suggestions = await getSuggestions(query, selectedZone);
                showSuggestions(suggestions, suggestionsContainer, direccionInput);
            } else {
                console.log('No se buscarán sugerencias - zona:', selectedZone, 'longitud:', query.length);
            }
        }, 300);
    });
    
    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!direccionInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Cerrar sugerencias con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    console.log('Sistema de autocompletado inicializado completamente');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initAutocomplete();
});