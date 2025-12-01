// Variable global para caché de búsquedas
// const searchCache = new Map();
// const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Función para determinar la zona según el origen o destino
// Simplificada para usar solo texto en lugar de llamadas a Geoapify
function determinarZona(direccion) {
    // 0. Verificaciones iniciales para aeropuertos (casos especiales)
    const dirLower = direccion.toLowerCase();
    
    // Verificación rápida de aeropuertos por nombre
    if (dirLower.includes('ezeiza') || dirLower.includes('pistarini') || 
        (dirLower.includes('aeropuerto') && (dirLower.includes('internacional') || dirLower.includes('ezeiza'))) ||
        dirLower.includes('ministro pistarini')) {
        return 'EZEIZA';
    }
    
    if (dirLower.includes('aeroparque') || (dirLower.includes('aeropuerto') && dirLower.includes('aeroparque')) ||
        (dirLower.includes('jorge newbery')) || dirLower.includes('newbery')) {
        return 'AEROPARQUE';
    }

    // 1. Intentar extraer CP directamente del texto (método principal y más rápido)
    // Patrón mejorado para manejar códigos postales como "C1426", "C 1426" y "C1426AGX"
    const cpRegex = /\b(?:C\s*)?(\d{4})(?:[a-zA-Z]*)?\b/gi;
    let match;

    while ((match = cpRegex.exec(direccion)) !== null) {
        const cp = parseInt(match[1]);
        if (!isNaN(cp) && cp >= 1000 && cp <= 9999) {
            const zonaCP = determinarZonaPorCP(cp);
            if (zonaCP) {
                console.log(`Zona determinada por CP extraído del texto (${cp}): ${zonaCP}`);
                return zonaCP;
            }
        }
    }

    // 2. Intentar con coincidencias de texto (método secundario)
    const zonaTexto = determinarZonaPorTexto(direccion);
    if (zonaTexto) {
        return zonaTexto;
    }

    // 3. Si no se puede determinar la zona, devolver null
    console.log('No se pudo determinar la zona para la dirección:', direccion);
    return null;
}



// Función auxiliar para determinar zona por coincidencias de texto
function determinarZonaPorTexto(direccion) {
    const dir = direccion.toLowerCase();
    
    // Verificar si la dirección está vacía o es muy corta
    if (!dir || dir.length < 4) {
        return null;
    }

    // EZEIZA - Verificación más robusta
    if (dir.includes('ezeiza') || dir.includes('pistarini') || 
        (dir.includes('aeropuerto') && (dir.includes('internacional') || dir.includes('ezeiza'))) ||
        dir.includes('ministro pistarini')) {
        return 'EZEIZA';
    }

    // AEROPARQUE - Verificación más robusta
    if (dir.includes('aeroparque') || (dir.includes('aeropuerto') && dir.includes('aeroparque')) ||
        (dir.includes('jorge newbery')) || dir.includes('newbery')) {
        return 'AEROPARQUE';
    }

    // CABA
    if (dir.includes('caba') || dir.includes('ciudad autónoma') || dir.includes('ciudad autonoma') ||
        dir.includes('capital federal') ||
        dir.includes('palermo') ||
        dir.includes('recoleta') || dir.includes('san telmo') ||
        dir.includes('la boca') || dir.includes('microcentro') ||
        dir.includes('puerto madero') || dir.includes('centro cívico') ||
        dir.includes('colegiales') || dir.includes('belgrano') ||
        dir.includes('nuñez') || dir.includes('saavedra') ||
        dir.includes('villa urquiza') || dir.includes('villa crespo') ||
        dir.includes('almagro') || dir.includes('caballito') ||
        // Verificar si contiene "buenos aires" pero no es un aeropuerto
        (dir.includes('buenos aires') && !dir.includes('ezeiza') && !dir.includes('aeroparque'))) {
        return 'CABA';
    }

    // ZONA SUR
    if (dir.includes('avellaneda') || dir.includes('lanús') || dir.includes('lanus')) return 'Avellaneda / Lanús';
    if (dir.includes('wilde') || dir.includes('monte chingolo')) return 'Wilde / Monte Chingolo';
    if (dir.includes('quilmes') || dir.includes('almirante brown') || dir.includes('alte brown')) return 'Quilmes / Alte Brown';
    if (dir.includes('berazategui') || dir.includes('hudson')) return 'Berazategui / Hudson';
    if (dir.includes('lomas de zamora')) return 'Lomas de Zamora';
    if (dir.includes('canning') || dir.includes('spegazzini')) return 'Canning / Spegazzini';
    if (dir.includes('la plata')) return 'La Plata';

    // ZONA OESTE
    if (dir.includes('ramos mejía') || dir.includes('ramos mejia') || dir.includes('ciudadela')) return 'Ramos Mejía / Ciudadela';
    if (dir.includes('morón') || dir.includes('moron') || dir.includes('haedo')) return 'Morón / Haedo';
    if (dir.includes('caseros') || dir.includes('el palomar')) return 'Caseros / El Palomar';
    if (dir.includes('hurlingham') || dir.includes('loma hermosa')) return 'Hurlingham / Loma Hermosa';
    if (dir.includes('ituzaingó') || dir.includes('ituzaingo') || dir.includes('padua')) return 'Ituzaingó / Padua';
    if (dir.includes('san miguel') || dir.includes('jose c. paz') || dir.includes('josé c. paz')) return 'San Miguel / José C. Paz';
    if (dir.includes('merlo') || dir.includes('paso del rey')) return 'Merlo / Paso del Rey';
    if (dir.includes('moreno') || dir.includes('francisco álvarez') || dir.includes('francisco alvarez')) return 'Moreno / Francisco Álvarez';
    if (dir.includes('general rodríguez') || dir.includes('gral. rodríguez') || dir.includes('general rodriguez')) return 'Gral. Rodríguez';
    if (dir.includes('luján') || dir.includes('lujan')) return 'Luján';

    // ZONA NORTE
    if (dir.includes('vicente lópez') || dir.includes('vicente lopez') || dir.includes('olivos')) return 'Vicente López / Olivos';
    if (dir.includes('san martín') || dir.includes('san martin') || dir.includes('san andrés') || dir.includes('san andres')) return 'San Martín / San Andrés';
    if (dir.includes('san isidro') || dir.includes('boulogne')) return 'San Isidro / Boulogne';
    if (dir.includes('villa ballester') || dir.includes('josé león suárez') || dir.includes('jose leon suarez')) return 'Villa Ballester / José León Suárez';
    if (dir.includes('tigre') || dir.includes('pacheco')) return 'Tigre Centro / Pacheco';
    if (dir.includes('don torcuato') || dir.includes('grand bourg')) return 'Don Torcuato / Grand Bourg';
    if (dir.includes('benavídez') || dir.includes('benavidez') || dir.includes('milberg') || dir.includes('tortuguitas')) return 'Benavídez / Milberg / Tortuguitas';
    if (dir.includes('ingeniero maschwitz') || dir.includes('ing. maschwitz') || dir.includes('del viso')) return 'Ing. Maschwitz / Del Viso';
    if (dir.includes('pilar') || dir.includes('escobar')) return 'Pilar / Escobar';
    if (dir.includes('campana') || dir.includes('cardales')) return 'Campana / Cardales';

    return null;
}





// Función para verificar si una dirección está en el área permitida
function isDireccionPermitida(direccion) {
    // Verificar que la dirección no sea undefined o null
    if (!direccion) return false;
    
    const direccionLower = direccion.toLowerCase();
    
    // Partidos y localidades permitidos (área metropolitana de Buenos Aires y provincia de Buenos Aires)
    const partidosPermitidos = [
        "buenos aires", "ciudad autónoma de buenos aires", "caba", "capital federal",
        "quilmes", "bernal", "wilde", "lanús", "lomas de zamora", 
        "adrogué", "monte grande", "ezeiza", "san justo", "ramos mejía",
        "morón", "caseros", "hurlingham", "san martín", "villa ballester",
        "olivos", "martínez", "san isidro", "vicente lópez",
        "zarate", "serodino", "villa general josé tomas guido", "general las heras",
        "moreno", "francisco álvarez", "merlo", "paso del rey", "ituzaingó", "padua",
        "san miguel", "josé c. paz", "tigre", "pacheco", "don torcuato", "grand bourg",
        "benavídez", "milberg", "tortuguitas", "ingeniero maschwitz", "del viso",
        "pilar", "escobar", "campana", "cardales", "luján", "general rodríguez",
        "lafayette"
    ];
    
    // Verificar si alguna de las localidades permitidas está en la dirección
    const isPartidoPermitido = partidosPermitidos.some(partido => 
        direccionLower.includes(partido.toLowerCase())
    );
    
    // Si no está en la lista de partidos, verificar si tiene un código postal de las zonas permitidas
    if (!isPartidoPermitido) {
        // Buscar códigos postales en la dirección
        const cpMatch = direccionLower.match(/b\d{4}/gi);
        if (cpMatch) {
            for (const cp of cpMatch) {
                const zona = determinarZonaPorCP(cp);
                if (zona) {
                    return true;
                }
            }
        }
        return false;
    }
    
    return isPartidoPermitido;
}





// Función para configurar el autocompletado en un input
function setupAutocomplete(inputId, suggestionsId) {
    console.log(`Setting up autocomplete for ${inputId}`);
    
    const input = document.getElementById(inputId);
    if (!input) {
        console.error(`Input with id ${inputId} not found`);
        return;
    }
    
    console.log(`Found input for ${inputId}:`, input);
    
    let suggestionsContainer = document.getElementById(suggestionsId);
    let debounceTimer;
    let isSelectingSuggestion = false;
    
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

    input.addEventListener('input', function () {
        console.log(`Input event triggered for ${inputId}:`, this.value);
        // Si estamos seleccionando una sugerencia, no hacer nada
        if (isSelectingSuggestion) {
            isSelectingSuggestion = false;
            return;
        }

        const query = this.value;
        console.log(`Query for ${inputId}:`, query);

        // Limpiar cache si el usuario edita manualmente
        delete input.dataset.address;

        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';

        // Para consultas muy cortas, no buscar
        if (query.length < 3) {
            console.log(`Query too short for ${inputId}:`, query.length);
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Para consultas que parecen códigos postales pero no están completos, no buscar
        if (/^\d+$/.test(query) && query.length < 4) {
            console.log(`Incomplete postal code for ${inputId}:`, query);
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Para consultas que contienen "B" seguido de números pero no están completos, no buscar
        if (/^b\d*$/i.test(query) && query.length < 6) {
            console.log(`Incomplete postal code format for ${inputId}:`, query);
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Aumentar el límite mínimo de caracteres para evitar búsquedas prematuras
        if (query.length < 4) {
            console.log(`Query still too short for ${inputId}:`, query.length);
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Verificar si el texto parece una dirección completa (con número)
        // Solo buscar si el texto contiene una calle y un número
        const hasStreetAndNumber = /\d/.test(query) && query.length >= 6;
        if (!hasStreetAndNumber) {
            console.log(`Query doesn't look like a complete address for ${inputId}:`, query);
            suggestionsContainer.style.display = 'none';
            return;
        }

        clearTimeout(debounceTimer);
        // Aumentar el tiempo de debounce a 1000ms para reducir búsquedas frecuentes
        debounceTimer = setTimeout(async () => {
            try {
                // Obtener la zona seleccionada
                const zonaSeleccionada = document.getElementById('zona-busqueda')?.value;
                
                // Construir el texto de búsqueda con la zona
                let searchText = query;
                if (zonaSeleccionada) {
                    // Para zonas compuestas como "Villa Ballester / José León Suárez", 
                    // usar solo la primera parte para la búsqueda
                    let zonaParaBusqueda = zonaSeleccionada;
                    if (zonaSeleccionada.includes(' / ')) {
                        // Dividir la zona compuesta y usar la primera parte
                        const partes = zonaSeleccionada.split(' / ');
                        zonaParaBusqueda = partes[0];
                    }
                    searchText = `${query}, ${zonaParaBusqueda}`;
                }
                
                console.log(`Searching for: ${searchText}`);
                
                // Usar Geoapify API para autocompletado
                const geoapifyUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchText)}&apiKey=1186162aedfa4b10adf6713a6dcf05e1&limit=10&filter=countrycode:ar`;
                
                // Lista de proxies alternativos
                const proxies = [
                    'https://api.codetabs.com/v1/proxy?quest=',
                    'https://corsproxy.io/?'
                ];
                
                // Probar diferentes proxies en orden
                let response;
                let lastError;
                
                for (const proxy of proxies) {
                    try {
                        const proxyUrl = proxy + encodeURIComponent(geoapifyUrl);
                        console.log(`Intentando con proxy para Geoapify: ${proxy}`);
                        
                        response = await fetch(proxyUrl);
                        
                        if (response.ok) {
                            console.log(`Éxito con proxy para Geoapify: ${proxy}`);
                            break;
                        } else {
                            console.log(`Error con proxy ${proxy} para Geoapify: ${response.status}`);
                            lastError = new Error(`HTTP error! status: ${response.status}`);
                        }
                    } catch (proxyError) {
                        console.log(`Error con proxy ${proxy} para Geoapify:`, proxyError);
                        lastError = proxyError;
                    }
                }
                
                // Si ninguno de los proxies funcionó, lanzar el último error
                if (!response || !response.ok) {
                    throw lastError || new Error('Todos los proxies fallaron para Geoapify');
                }
                
                // Parsear la respuesta
                const rawData = await response.json();
                const geoapifyResults = rawData.features || [];
                
                console.log('Resultados de Geoapify:', geoapifyResults);
                
                // Filtrar resultados por área permitida y zona seleccionada
                const filteredResults = geoapifyResults.filter(item => {
                    const displayName = item.properties?.formatted || item.properties?.name;
                    
                    // Si no hay nombre para mostrar, descartar
                    if (!displayName) return false;
                    
                    // Verificar que la dirección esté en Buenos Aires o CABA
                    const state = item.properties?.state || '';
                    const city = item.properties?.city || '';
                    const isInBA = state.toLowerCase().includes('buenos aires') || city.toLowerCase().includes('buenos aires') || city.toLowerCase().includes('caba') || city.toLowerCase().includes('capital federal');
                    
                    // Si no está en Buenos Aires o CABA, descartar
                    if (!isInBA) return false;
                    
                    // Si hay una zona seleccionada, verificar que el resultado esté en esa zona
                    if (zonaSeleccionada) {
                        const addressText = `${item.properties?.formatted || ''} ${item.properties?.city || ''} ${item.properties?.state || ''}`.toLowerCase();
                        return addressText.includes(zonaSeleccionada.toLowerCase());
                    }
                    
                    return true;
                });
                
                console.log('Resultados filtrados:', filteredResults);
                
                // Convertir resultados al formato para mostrar
                const formattedResults = filteredResults.map(result => {
                    return {
                        display_name: (result.properties?.formatted || result.properties?.name) ?? 'Dirección sin nombre',
                        address: result.properties ? {
                            house_number: result.properties?.housenumber,
                            road: result.properties?.street,
                            neighbourhood: result.properties?.neighbourhood,
                            suburb: result.properties?.suburb,
                            city: result.properties?.city,
                            town: result.properties?.town,
                            municipality: result.properties?.municipality,
                            county: result.properties?.county,
                            state: result.properties?.state,
                            postcode: result.properties?.postcode,
                            country: result.properties?.country
                        } : {},
                        lat: result.geometry?.coordinates?.[1],
                        lon: result.geometry?.coordinates?.[0],
                        isCommonPlace: false
                    };
                });
                
                console.log('Resultados formateados:', formattedResults);
                
                // Mostrar resultados
                if (formattedResults.length > 0) {
                    displaySuggestions(formattedResults);
                } else {
                    // Si no hay resultados, mostrar un mensaje
                    suggestionsContainer.style.display = 'block';
                    suggestionsContainer.innerHTML = '<div class="autocomplete-item" style="padding: 12px 16px; color: #666;">No se encontraron resultados. Intente con otra dirección.</div>';
                }
            } catch (error) {
                console.error('Error fetching suggestions para consulta:', query, error);
                suggestionsContainer.style.display = 'block';
                suggestionsContainer.innerHTML = '<div class="autocomplete-item" style="padding: 12px 16px; color: #666;">Error al buscar direcciones. Intente nuevamente.</div>';
            }
        }, 1000); // Aumentar el tiempo de debounce a 1000ms para reducir búsquedas frecuentes
    });


    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (e.target !== input && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Función para mostrar sugerencias
    function displaySuggestions(results) {
        suggestionsContainer.innerHTML = '';
        
        if (results.length > 0) {
            suggestionsContainer.style.display = 'block';
            
            results.forEach(result => {
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
                
                let displayText = result.display_name;
                
                // Para lugares comunes, usar el nombre directamente
                if (result.isCommonPlace) {
                    displayText = result.display_name;
                    div.style.fontWeight = '600';
                    div.style.color = '#2C4A7C';
                } else if (result.address) {
                    // Para resultados de Geoapify, formatear la dirección
                    const parts = [];
                    
                    // Agregar siempre el nombre de display como base
                    if (result.display_name && result.display_name !== 'Dirección sin nombre') {
                        parts.push(result.display_name);
                    } else {
                        // Si no hay nombre de display, construir desde partes disponibles
                        if (result.address.road) parts.push(result.address.road);
                        if (result.address.house_number) parts.push(result.address.house_number);
                    }
                    
                    // Si no hay nombre de display pero sí tenemos calle y número, combinarlos
                    if ((!result.display_name || result.display_name === 'Dirección sin nombre') && 
                        result.address.road && result.address.house_number) {
                        parts.unshift(`${result.address.road} ${result.address.house_number}`);
                    }
                    
                    // Mostrar el código postal si está disponible
                    if (result.address.postcode) {
                        // Extraer solo los dígitos del código postal
                        const cpMatch = result.address.postcode.match(/\d+/);
                        if (cpMatch) {
                            const cp = parseInt(cpMatch[0]);
                            if (cp >= 1000 && cp <= 9999) {
                                parts.push(`CP: ${cp}`);
                            }
                        }
                    }
                    
                    // Si ya tenemos información de zona en el resultado, mostrarla
                    if (result.zonaDeterminada) {
                        parts.push(`Zona: ${result.zonaDeterminada}`);
                    }
                    
                    if (parts.length > 0) {
                        displayText = parts.join(' - ');
                    } else {
                        // Si no hay partes específicas, usar el nombre de display
                        displayText = result.display_name;
                    }
                } else {
                    // Si no hay dirección, usar el nombre de display
                    displayText = result.display_name;
                }
                
                div.innerHTML = `<strong>${displayText}</strong>`;
                
                div.addEventListener('mouseenter', function () {
                    this.style.backgroundColor = '#f5f8fc';
                });
                
                div.addEventListener('mouseleave', function () {
                    this.style.backgroundColor = 'white';
                });
                
                div.addEventListener('click', function () {
                    // Activar flag antes de cambiar el valor
                    isSelectingSuggestion = true;
                    
                    // Usar el texto formateado para el input
                    input.value = displayText;
                    // Cachear detalles de la dirección
                    if (result.isCommonPlace) {
                        input.dataset.address = JSON.stringify({
                            road: result.display_name,
                            full_address: result.address
                        });
                    } else {
                        input.dataset.address = JSON.stringify(result.address);
                    }
                    
                    suggestionsContainer.style.display = 'none';
                    suggestionsContainer.innerHTML = '';
                    
                    // Disparar evento input para actualizar precio
                    input.dispatchEvent(new Event('input'));
                });
                
                suggestionsContainer.appendChild(div);
            });
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }

    // Cerrar sugerencias con Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
        }
    });
}

// Event listeners para actualizar el precio en tiempo real
document.addEventListener('DOMContentLoaded', function () {
    const origenInput = document.getElementById('origen');
    const destinoInput = document.getElementById('destino');
    const maletasInput = document.getElementById('maletas');
    const equipajeCheckbox = document.getElementById('equipaje');

    console.log('Initializing autocomplete system...');
    console.log('Origen input:', origenInput);
    console.log('Destino input:', destinoInput);

    if (origenInput) {
        console.log('Setting up autocomplete for origen');
        setupAutocomplete('origen', 'origen-suggestions');
    }
    
    if (destinoInput) {
        console.log('Setting up autocomplete for destino');
        setupAutocomplete('destino', 'destino-suggestions');
    }
    
    console.log('Finished setting up autocompletes');

    // Sistema de actualización de precio eliminado
    // La determinación de precios se hará de forma dinámica sin mostrar una burbuja flotante

    if (equipajeCheckbox) {
        // Remover cualquier listener previo para evitar duplicados
        const toggleLuggageSection = function () {
            const luggageDetails = document.getElementById('luggageDetails');
            if (this.checked) {
                luggageDetails.classList.add('active');
            } else {
                luggageDetails.classList.remove('active');
            }
            // Sistema de burbuja eliminado
        };

        // Remover listeners antiguos y agregar el nuevo
        equipajeCheckbox.replaceWith(equipajeCheckbox.cloneNode(true));
        const newEquipajeCheckbox = document.getElementById('equipaje');
        newEquipajeCheckbox.addEventListener('change', toggleLuggageSection);

        // Agregar click al contenedor para mejor UX
        const checkboxContainer = document.querySelector('.checkbox-container');
        if (checkboxContainer) {
            checkboxContainer.addEventListener('click', function(e) {
                // Prevenir el doble toggle si se hace clic directamente en el checkbox
                if (e.target !== newEquipajeCheckbox) {
                    newEquipajeCheckbox.checked = !newEquipajeCheckbox.checked;
                    newEquipajeCheckbox.dispatchEvent(new Event('change'));
                }
            });
        }
    }
});