// Sistema de autocompletado con Geoapify para empresa de traslados
// Reglas estrictas de implementación

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

// Función principal para obtener sugerencias (solo LocationIQ por ahora)
async function getSuggestions(query) {
    console.log('Obteniendo sugerencias de LocationIQ para:', query);
    
    // Usar solo LocationIQ por ahora
    const suggestions = await getLocationIQSuggestions(query);
    
    return suggestions;
}

// Función para resolver la etiqueta de localidad con fallback estricto
function getLocationLabel(properties) {
    // Resolver con fallback estricto según las reglas
    const locationLabel = properties.city ||
                         properties.suburb ||
                         properties.district ||
                         properties.county ||
                         "Localidad no especificada";
    
    console.log('Etiqueta de localidad resuelta:', locationLabel, properties);
    return locationLabel;
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
    
    // Ordenar sugerencias para priorizar resultados relevantes
    suggestions.sort((a, b) => {
        // Priorizar resultados que contienen las palabras buscadas en el mismo orden
        const queryLower = document.getElementById(input.id)?.value.toLowerCase() || '';
        
        const displayNameALower = a.properties.formatted?.toLowerCase() || '';
        const displayNameBLower = b.properties.formatted?.toLowerCase() || '';
        
        // Dividir la consulta en palabras
        const queryWords = queryLower.split(' ').filter(word => word.length > 0);
        
        // Contar cuántas palabras consecutivas coinciden al inicio
        const getMatchScore = (displayName) => {
            let score = 0;
            for (let i = 0; i < queryWords.length; i++) {
                if (displayName.includes(queryWords[i])) {
                    score++;
                } else {
                    break;
                }
            }
            return score;
        };
        
        const scoreA = getMatchScore(displayNameALower);
        const scoreB = getMatchScore(displayNameBLower);
        
        // Si uno tiene mejor puntaje de coincidencia, priorizarlo
        if (scoreA > scoreB) return -1;
        if (scoreB > scoreA) return 1;
        
        // Si ambos tienen el mismo puntaje, verificar coincidencia exacta
        const containsExactQueryA = displayNameALower.includes(queryLower);
        const containsExactQueryB = displayNameBLower.includes(queryLower);
        
        // Si uno contiene la frase exacta y el otro no, priorizar el que la contiene
        if (containsExactQueryA && !containsExactQueryB) return -1;
        if (!containsExactQueryA && containsExactQueryB) return 1;
        
        // Priorizar Buenos Aires y CABA
        const isBuenosAiresA = a.properties.state === 'Buenos Aires' || 
                              a.properties.state === 'Ciudad Autónoma de Buenos Aires' ||
                              a.properties.state_district === 'Buenos Aires' ||
                              a.properties.state_district === 'Ciudad Autónoma de Buenos Aires';
        const isBuenosAiresB = b.properties.state === 'Buenos Aires' || 
                              b.properties.state === 'Ciudad Autónoma de Buenos Aires' ||
                              b.properties.state_district === 'Buenos Aires' ||
                              b.properties.state_district === 'Ciudad Autónoma de Buenos Aires';
        
        // Priorizar Buenos Aires y CABA
        if (isBuenosAiresA && !isBuenosAiresB) return -1;
        if (!isBuenosAiresA && isBuenosAiresB) return 1;
        
        // Si ambos son de Buenos Aires/CABA o ambos no lo son, mantener el orden original
        return 0;
    });
    
    suggestions.forEach((suggestion, index) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        
        const address = suggestion.properties;
        const geometry = suggestion.geometry;
        
        // Mostrar información de depuración detallada
        console.log(`Sugerencia ${index + 1}:`, address);
        
        // Construir una dirección bien formateada
        const place = {
            address: {
                road: address.street,
                house_number: address.housenumber,
                postcode: address.postcode,
                suburb: address.suburb,
                city: address.city,
                town: address.city,
                state: suggestion.properties.state || suggestion.properties.state_district
            },
            display_name: address.formatted || address.name
        };
        
        const displayName = buildAddress(place);
        const displayDetails = '';
        
        div.innerHTML = `
            <div class="suggestion-name">${displayName}</div>
            ${displayDetails ? `<div class="suggestion-details">${displayDetails}</div>` : ''}
        `;
        
        div.addEventListener('click', () => {
            input.value = displayName;
            // Guardar la dirección completa y coordenadas en atributos de datos
            const houseNumber = address.housenumber || '';
            const street = address.street || '';
            const locationLabel = getLocationLabel(address);
            const fullAddress = [houseNumber, street, locationLabel].filter(Boolean).join(', ');
            input.setAttribute('data-full-address', fullAddress);
            input.setAttribute('data-lat', geometry.coordinates[1]);
            input.setAttribute('data-lon', geometry.coordinates[0]);
            container.style.display = 'none';
            
            // Disparar evento input para validar
            input.dispatchEvent(new Event('input'));
            console.log('Seleccionada sugerencia:', displayName);
            
            // Validación adicional post-selección según reglas
            validateSelectedAddress(suggestion, input);
        });
        
        container.appendChild(div);
        console.log(`Agregada sugerencia ${index + 1}:`, displayName, '| Detalles:', displayDetails);
    });
    
    container.style.display = 'block';
    console.log('Contenedor de sugerencias mostrado con estilo:', container.style.display);
    console.log('Contenedor de sugerencias:', container);
    console.log('Posición del contenedor:', container.getBoundingClientRect());
}

// Función para validar dirección seleccionada post-selección
function validateSelectedAddress(suggestion, input) {
    const geometry = suggestion.geometry;
    const lon = geometry.coordinates[0];
    const lat = geometry.coordinates[1];
    
    // Validar obligatoriamente coordenadas
    const isValid = isInsideBBox(lon, lat);
    
    console.log('Validación post-selección - Coordenadas:', lat, lon, 'Válido:', isValid);
    
    if (!isValid) {
        // Mostrar error si falla la validación
        console.error('Dirección fuera del área permitida:', {lat, lon});
        // Aquí podrías mostrar un mensaje de error al usuario
        alert('La dirección seleccionada está fuera del área de servicio permitida.');
        input.value = ''; // Limpiar el campo
        return false;
    }
    
    return true;
}

// Inicializar autocompletado
function initAutocomplete(inputId, containerId) {
    console.log('Inicializando sistema de autocompletado con reglas estrictas');
    
    // Verificar que los elementos existan
    const input = document.getElementById(inputId);
    if (!input) {
        console.log('No se encontró el elemento input con ID:', inputId);
        return;
    }
    
    console.log('Elemento input encontrado, configurando autocompletado...');
    
    // Crear contenedor para sugerencias si no existe
    let suggestionsContainer = document.getElementById(containerId);
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = containerId;
        suggestionsContainer.className = 'suggestions-container';
        input.parentNode.appendChild(suggestionsContainer);
        console.log('Contenedor de sugerencias creado');
    } else {
        console.log('Contenedor de sugerencias ya existe');
    }
    
    // Event listener para el input con debounce
    input.addEventListener('input', debounce(function(event) {
        const query = event.target.value.trim();
        
        console.log('Input event:', query);
        
        // Ocultar sugerencias si no hay consulta
        if (!query) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        if (query.length >= 3) {
            console.log('Buscando sugerencias...');
            getSuggestions(query).then(suggestions => {
                showSuggestions(suggestions, suggestionsContainer, input);
            });
        } else {
            console.log('No se buscarán sugerencias - longitud:', query.length);
        }
    }, DEBOUNCE_MS));
    
    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Cerrar sugerencias con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    console.log('Sistema de autocompletado con reglas estrictas inicializado completamente');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar para la página de test
    initAutocomplete('direccion', 'direccion-suggestions');
    
    // Inicializar autocompletado para los campos de origen y destino del formulario de reserva
    if (document.getElementById('origen')) {
        initAutocomplete('origen', 'origen-suggestions');
    }
    
    if (document.getElementById('destino')) {
        initAutocomplete('destino', 'destino-suggestions');
    }
});