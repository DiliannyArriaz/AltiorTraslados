// Tabla de precios por zonas
const tablaPrecios = {
    // HACIA / DESDE EZEIZA
    'EZEIZA': {
        urbano: 49900,
        kangoo: 65900
    },
    // HACIA / DESDE AEROPARQUE
    'AEROPARQUE': {
        urbano: 0,
        kangoo: 0,
        subzonas: {
            // CABA
            'CABA': { urbano: 35000, kangoo: 45000 },
            // Zona Sur
            'Avellaneda / Lanús': { urbano: 45000, kangoo: 59000 },
            'Wilde / Monte Chingolo': { urbano: 49000, kangoo: 65000 },
            'Quilmes / Alte Brown': { urbano: 49900, kangoo: 65000 },
            'Berazategui / Hudson': { urbano: 55000, kangoo: 69000 },
            'Lomas de Zamora': { urbano: 55000, kangoo: 69000 },
            'Canning / Spegazzini': { urbano: 69000, kangoo: 85000 },
            'La Plata': { urbano: 85000, kangoo: 95000 },
            // Zona Norte
            'Vicente López / Olivos': { urbano: 35000, kangoo: 45000 },
            'San Martín / San Andrés': { urbano: 45000, kangoo: 55000 },
            'San Isidro / Boulogne': { urbano: 45000, kangoo: 55000 },
            'Villa Ballester / José León Suárez': { urbano: 49000, kangoo: 59000 },
            'Tigre Centro / Pacheco': { urbano: 49000, kangoo: 59000 },
            'Don Torcuato / Grand Bourg': { urbano: 55000, kangoo: 65000 },
            'Benavídez / Milberg / Tortuguitas': { urbano: 59000, kangoo: 69000 },
            'Ing. Maschwitz / Del Viso': { urbano: 59000, kangoo: 70000 },
            'Pilar / Escobar': { urbano: 69000, kangoo: 79000 },
            'Campana / Cardales': { urbano: 110000, kangoo: 129000 }
        }
    },
    // CONEXIÓN ENTRE AEROPUERTOS
    'Aeroparque / Ezeiza Conexión': { urbano: 55000, kangoo: 75000 },
    'ZONA SUR': {
        urbano: 0,
        kangoo: 0,
        subzonas: {
            'Avellaneda / Lanús': { urbano: 55000, kangoo: 64900 },
            'Wilde / Monte Chingolo': { urbano: 59900, kangoo: 75000 },
            'Quilmes / Alte Brown': { urbano: 64900, kangoo: 79000 },
            'Berazategui / Hudson': { urbano: 78000, kangoo: 89000 },
            'Lomas de Zamora': { urbano: 58000, kangoo: 74900 },
            'Canning / Spegazzini': { urbano: 55000, kangoo: 75000 },
            'La Plata': { urbano: 95000, kangoo: 130000 }
        }
    },
    'ZONA OESTE': {
        urbano: 0,
        kangoo: 0,
        subzonas: {
            'Ramos Mejía / Ciudadela': { urbano: 49900, kangoo: 65000 },
            'Morón / Haedo': { urbano: 58000, kangoo: 69000 },
            'Caseros / El Palomar': { urbano: 55000, kangoo: 69000 },
            'Hurlingham / Loma Hermosa': { urbano: 59900, kangoo: 75000 },
            'Ituzaingó / Padua': { urbano: 65000, kangoo: 75000 },
            'San Miguel / José C. Paz': { urbano: 75000, kangoo: 85000 },
            'Merlo / Paso del Rey': { urbano: 79000, kangoo: 90000 },
            'Moreno / Francisco Álvarez': { urbano: 95000, kangoo: 95000 },
            'Gral. Rodríguez': { urbano: 79000, kangoo: 90000 },
            'Luján': { urbano: 95000, kangoo: 120000 }
        }
    },
    'ZONA NORTE': {
        urbano: 0,
        kangoo: 0,
        subzonas: {
            'Vicente López / Olivos': { urbano: 55000, kangoo: 69900 },
            'San Martín / San Andrés': { urbano: 53000, kangoo: 69000 },
            'San Isidro / Boulogne': { urbano: 59900, kangoo: 74900 },
            'Villa Ballester / José León Suárez': { urbano: 65000, kangoo: 79000 },
            'Tigre Centro / Pacheco': { urbano: 69000, kangoo: 80000 },
            'Don Torcuato / Grand Bourg': { urbano: 69000, kangoo: 85000 },
            'Benavídez / Milberg / Tortuguitas': { urbano: 75000, kangoo: 89000 },
            'Ing. Maschwitz / Del Viso': { urbano: 75000, kangoo: 90000 },
            'Pilar / Escobar': { urbano: 95000, kangoo: 110000 },
            'Campana / Cardales': { urbano: 120000, kangoo: 150000 }
        }
    }
};

// Definición de Zonas por Código Postal
const ZONAS_CP = {
    'CABA': { min: 1000, max: 1499 },
    'Avellaneda / Lanús': [1870, 1871, 1872, 1873, 1874, 1875, 1822, 1824],
    'Wilde / Monte Chingolo': [1875],
    'Quilmes / Alte Brown': [1878, 1879, 1846],
    'Berazategui / Hudson': [1880, 1884, 1885, 1886],
    'Lomas de Zamora': [1832],
    'Canning / Spegazzini': [1804, 1812],
    'La Plata': [1900],
    'Ramos Mejía / Ciudadela': [1704, 1702],
    'Morón / Haedo': [1708, 1706],
    'Caseros / El Palomar': [1678, 1684],
    'Hurlingham / Loma Hermosa': [1686, 1657],
    'Ituzaingó / Padua': [1714, 1718],
    'San Miguel / José C. Paz': [1663, 1665],
    'Merlo / Paso del Rey': [1722, 1742],
    'Moreno / Francisco Álvarez': [1744, 1746],
    'Gral. Rodríguez': [1748],
    'Luján': [6700],
    'Vicente López / Olivos': [1636, 1638, 1602],
    'San Martín / San Andrés': [1650, 1651],
    'San Isidro / Boulogne': [1642, 1609, 1640, 1641, 1643, 1644, 1646],
    'Villa Ballester / José León Suárez': [1653, 1655],
    'Tigre Centro / Pacheco': [1648, 1617, 1618],
    'Don Torcuato / Grand Bourg': [1611, 1615],
    'Benavídez / Milberg / Tortuguitas': [1621, 1619, 1667],
    'Ing. Maschwitz / Del Viso': [1623, 1669],
    'Pilar / Escobar': [1629, 1625, 1630],
    'Campana / Cardales': [2804, 2814]
};

// Función auxiliar para determinar zona desde los detalles de dirección (Nominatim)
function determinarZonaFromDetails(address) {
    if (!address) return null;

    // FIX: Zarate 5300 specific check
    if (address.road && address.road.includes('Zarate') && address.house_number === '5300') {
        return 'Villa Ballester / José León Suárez';
    }

    // FIX: Check by Postal Code
    if (address.postcode) {
        const cp = parseInt(address.postcode.replace(/\D/g, ''));
        const zonaCP = determinarZonaPorCP(cp);
        if (zonaCP) {
            console.log(`Zona determinada por CP de detalles ${cp}: ${zonaCP}`);
            return zonaCP;
        }
    }

    // AEROPUERTOS - Verificación más robusta
    // EZEIZA
    if ((address.airport && (address.airport.includes('Ezeiza') || address.airport.includes('Ministro Pistarini'))) ||
        (address.name && address.name.includes('Aeropuerto')) && 
        (address.name.includes('Ezeiza') || address.name.includes('Internacional') || address.name.includes('Pistarini')) ||
        (address.road && address.road.includes('Hermógenes Salgado'))) {
        return 'EZEIZA';
    }

    // AEROPARQUE
    if ((address.airport && address.airport.includes('Aeroparque')) ||
        (address.name && address.name.includes('Aeroparque')) ||
        (address.road && address.road.includes('Jorge Newbery'))) {
        return 'AEROPARQUE';
    }

    // ZONA NORTE
    if (address.city === 'Villa Ballester' || address.town === 'Villa Ballester' ||
        (address.municipality && address.municipality.includes('Villa Ballester')) ||
        (address.neighbourhood && address.neighbourhood.includes('Villa Pineral'))) {
        return 'Villa Ballester / José León Suárez';
    }

    if (address.city === 'San Martín' || address.town === 'San Martín' ||
        (address.municipality && address.municipality.includes('San Martín'))) {
        return 'San Martín / San Andrés';
    }

    if (address.city === 'Olivos' || address.town === 'Olivos' ||
        (address.municipality && address.municipality.includes('Olivos'))) {
        return 'Vicente López / Olivos';
    }

    // ZONA OESTE
    if (address.city === 'Morón' || address.town === 'Morón' ||
        (address.municipality && address.municipality.includes('Morón'))) {
        return 'Morón / Haedo';
    }

    if (address.city === 'Caseros' || address.town === 'Caseros' ||
        (address.municipality && address.municipality.includes('Caseros'))) {
        return 'Caseros / El Palomar';
    }

    // ZONA SUR
    if (address.city === 'Quilmes' || address.town === 'Quilmes' ||
        (address.municipality && address.municipality.includes('Quilmes'))) {
        return 'Quilmes / Alte Brown';
    }

    if (address.city === 'Lomas de Zamora' || address.town === 'Lomas de Zamora' ||
        (address.municipality && address.municipality.includes('Lomas de Zamora'))) {
        return 'Lomas de Zamora';
    }

    // CABA
    if (address.city === 'Buenos Aires' || address.state === 'Ciudad Autónoma de Buenos Aires') {
        return 'CABA';
    }

    return null;
}

// Función para determinar la zona según el origen o destino
async function determinarZona(direccion, cachedDetails = null) {
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

    // 1. Usar detalles cacheados si existen y son relevantes para la dirección actual (Optimización)
    if (cachedDetails) {
        console.log('Usando detalles de dirección cacheados');
        
        // Verificar si los datos cacheados son relevantes para la dirección actual
        // Solo usar los datos cacheados si contienen información que coincida con la dirección actual
        const direccionLower = direccion.toLowerCase();
        let esRelevante = false;
        
        // Verificar si algún campo de los datos cacheados contiene parte de la dirección actual
        for (const key in cachedDetails) {
            if (cachedDetails[key] && 
                typeof cachedDetails[key] === 'string' && 
                direccionLower.includes(cachedDetails[key].toLowerCase())) {
                esRelevante = true;
                break;
            }
        }
        
        // También verificar casos especiales como aeropuertos
        if (!esRelevante && (
            (direccionLower.includes('aeroparque') && cachedDetails.airport && cachedDetails.airport.includes('Aeroparque')) ||
            (direccionLower.includes('aeroparque') && cachedDetails.full_address && cachedDetails.full_address.includes('Aeroparque')) ||
            (direccionLower.includes('aeroparque') && cachedDetails.road && cachedDetails.road.includes('Aeroparque')) ||
            (direccionLower.includes('aeroparque') && cachedDetails.name && cachedDetails.name.includes('Aeroparque')) ||
            (direccionLower.includes('ezeiza') && cachedDetails.full_address && cachedDetails.full_address.includes('Ezeiza')) ||
            (direccionLower.includes('ezeiza') && cachedDetails.airport && cachedDetails.airport.includes('Ezeiza')) ||
            (direccionLower.includes('ezeiza') && cachedDetails.road && cachedDetails.road.includes('Ezeiza')) ||
            (direccionLower.includes('ezeiza') && cachedDetails.name && cachedDetails.name.includes('Ezeiza'))
        )) {
            esRelevante = true;
        }
        
        // Verificación adicional: si la dirección es corta (menos de 5 caracteres), no usar datos cacheados
        // Esto evita usar datos cacheados cuando el usuario está escribiendo una nueva dirección
        if (direccion.length < 5) {
            esRelevante = false;
        }
        
        if (esRelevante) {
            const zona = determinarZonaFromDetails(cachedDetails);
            if (zona) return zona;
        } else {
            // Limpiar datos cacheados si no son relevantes
            // Esto ayuda a evitar interferencias entre direcciones diferentes
            console.log('Datos cacheados no son relevantes, ignorando');
        }
    }

    // 2. Intentar extraer CP directamente del texto (método principal y más rápido)
    // Patrón mejorado para manejar códigos postales como "C1426", "C 1426" y "C1426AGX"
    const cpRegex = /\b(?:C\s*)?(\d{4})(?:[a-zA-Z]*)?\b/gi;
    let match;

    while ((match = cpRegex.exec(direccion)) !== null) {
        const cp = parseInt(match[1]);
        if (cp >= 1000 && cp <= 9999) {
            const zonaCP = determinarZonaPorCP(cp);
            if (zonaCP) {
                console.log(`Zona determinada por CP extraído del texto (${cp}): ${zonaCP}`);
                return zonaCP;
            }
        }
    }

    // 3. Intentar con coincidencias de texto (método secundario)
    const zonaTexto = determinarZonaPorTexto(direccion);
    if (zonaTexto) {
        return zonaTexto;
    }

    // 4. Solo como último recurso, buscar con LocationIQ a través de proxy CORS con fallback
    // Implementar retry con backoff exponencial para manejar errores de red
    const maxRetries = 2; // Reducir intentos para evitar límites de tasa
    const baseDelay = 2000; // Aumentar tiempo de espera inicial a 2 segundos
    
    // Solo intentar con LocationIQ si la dirección tiene al menos 4 caracteres
    // para evitar llamadas innecesarias
    if (direccion.length < 4) {
        console.log('Dirección muy corta para buscar en LocationIQ');
        return null;
    }
    
    // Lista de proxies alternativos (actualizada para evitar errores 401)
    const proxies = [
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://corsproxy.io/?'
    ];
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // Agregar un pequeño retraso antes de la primera llamada para evitar sobrecarga
            if (attempt === 0) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Construir la URL de LocationIQ
            const locationIQUrl = `https://api.locationiq.com/v1/search.php?key=pk.6234567b586b647771556a706d6e446e626a676e64694c6e626a676e&q=${encodeURIComponent(direccion)}&format=json&countrycodes=AR&limit=1`;
            
            // Probar diferentes proxies en orden
            let response;
            let lastError;
            
            for (const proxy of proxies) {
                try {
                    const proxyUrl = proxy + encodeURIComponent(locationIQUrl);
                    console.log(`Intentando con proxy para LocationIQ (determinar zona): ${proxy}`);
                    
                    response = await fetch(proxyUrl);
                    
                    if (response.ok) {
                        console.log(`Éxito con proxy para LocationIQ (determinar zona): ${proxy}`);
                        break;
                    } else {
                        console.log(`Error con proxy ${proxy} para LocationIQ (determinar zona): ${response.status}`);
                        lastError = new Error(`HTTP error! status: ${response.status}`);
                    }
                } catch (proxyError) {
                    console.log(`Error con proxy ${proxy} para LocationIQ (determinar zona):`, proxyError);
                    lastError = proxyError;
                }
            }
            
            // Si ninguno de los proxies funcionó, lanzar el último error
            if (!response || !response.ok) {
                throw lastError || new Error('Todos los proxies fallaron para LocationIQ (determinar zona)');
            }

            const results = await response.json();

            if (results && results.length > 0) {
                const result = results[0];
                const address = {
                    house_number: result.address?.house_number,
                    road: result.address?.road,
                    neighbourhood: result.address?.neighbourhood,
                    suburb: result.address?.suburb,
                    city: result.address?.city,
                    town: result.address?.town,
                    municipality: result.address?.municipality,
                    county: result.address?.county,
                    state: result.address?.state,
                    postcode: result.address?.postcode,
                    country: result.address?.country
                };
                console.log('LocationIQ result:', address);

                const zona = determinarZonaFromDetails(address);
                if (zona) return zona;
            }
            
            // Si llegamos aquí, significa que la llamada fue exitosa pero no se encontró zona
            break;
        } catch (error) {
            console.error(`Error buscando dirección en LocationIQ (intento ${attempt + 1}/${maxRetries}):`, error);
            
            // Si es el último intento, retornar null
            if (attempt === maxRetries - 1) {
                console.log('Todos los intentos fallaron, retornando null');
                return null;
            }
            
            // Esperar antes de reintentar (backoff exponencial)
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`Esperando ${delay}ms antes de reintentar...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    return null;
}

// Función para determinar zona por Código Postal
function determinarZonaPorCP(cp) {
    if (!cp || typeof ZONAS_CP === 'undefined') return null;

    for (const [zona, codigos] of Object.entries(ZONAS_CP)) {
        if (codigos.min && codigos.max) {
            if (cp >= codigos.min && cp <= codigos.max) {
                return zona;
            }
        }
        else if (Array.isArray(codigos)) {
            const match = codigos.some(codigo => {
                const numCodigo = parseInt(String(codigo).replace(/\D/g, ''));
                return numCodigo === cp;
            });
            if (match) return zona;
        }
    }
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

// Función para calcular el precio del traslado
async function calcularPrecio(origen, destino, numMaletas, origenDetails = null, destinoDetails = null) {
    console.log(`Calculando precio: Origen="${origen}", Destino="${destino}", Maletas=${numMaletas}`);

    const zonaOrigen = await determinarZona(origen, origenDetails);
    const zonaDestino = await determinarZona(destino, destinoDetails);

    console.log(`Zona Origen: ${zonaOrigen}`);
    console.log(`Zona Destino: ${zonaDestino}`);

    if (!zonaOrigen || !zonaDestino) {
        console.log('Una de las zonas es null, retornando null');
        return null;
    }

    // Caso especial: Conexión entre Aeroparque y Ezeiza
    if ((zonaOrigen === 'AEROPARQUE' && zonaDestino === 'EZEIZA') || 
        (zonaOrigen === 'EZEIZA' && zonaDestino === 'AEROPARQUE')) {
        const usarKangoo = numMaletas > 3;
        const tipoVehiculo = usarKangoo ? 'kangoo' : 'urbano';
        return tablaPrecios['Aeroparque / Ezeiza Conexión'][tipoVehiculo];
    }

    const usarKangoo = numMaletas > 3;
    const tipoVehiculo = usarKangoo ? 'kangoo' : 'urbano';
    console.log(`Tipo Vehículo: ${tipoVehiculo}`);

    let precioOrigen = null;
    let precioDestino = null;

    // Buscar precio para el origen
    // Primero buscar directamente en las zonas principales
    if (tablaPrecios[zonaOrigen]) {
        precioOrigen = tablaPrecios[zonaOrigen][tipoVehiculo];
        // Si el precio es 0, buscar en subzonas
        if (precioOrigen === 0 && tablaPrecios[zonaOrigen].subzonas) {
            // Ya tenemos la zona origen, buscar directamente en subzonas
            if (tablaPrecios[zonaOrigen].subzonas[zonaOrigen]) {
                precioOrigen = tablaPrecios[zonaOrigen].subzonas[zonaOrigen][tipoVehiculo];
            }
        }
    } else {
        // Si no se encuentra como zona principal, buscar en subzonas de EZEIZA primero, luego AEROPARQUE
        // Priorizar EZEIZA ya que tiene tarifas más altas para las mismas zonas
        if (tablaPrecios['EZEIZA'] && tablaPrecios['EZEIZA'].subzonas && tablaPrecios['EZEIZA'].subzonas[zonaOrigen]) {
            precioOrigen = tablaPrecios['EZEIZA'].subzonas[zonaOrigen][tipoVehiculo];
        } else if (tablaPrecios['AEROPARQUE'] && tablaPrecios['AEROPARQUE'].subzonas && tablaPrecios['AEROPARQUE'].subzonas[zonaOrigen]) {
            precioOrigen = tablaPrecios['AEROPARQUE'].subzonas[zonaOrigen][tipoVehiculo];
        }
    }

    // Buscar precio para el destino
    // Primero buscar directamente en las zonas principales
    if (tablaPrecios[zonaDestino]) {
        precioDestino = tablaPrecios[zonaDestino][tipoVehiculo];
        // Si el precio es 0, buscar en subzonas
        if (precioDestino === 0 && tablaPrecios[zonaDestino].subzonas) {
            // Ya tenemos la zona destino, buscar directamente en subzonas
            if (tablaPrecios[zonaDestino].subzonas[zonaDestino]) {
                precioDestino = tablaPrecios[zonaDestino].subzonas[zonaDestino][tipoVehiculo];
            }
        }
    } else {
        // Si no se encuentra como zona principal, buscar en subzonas de EZEIZA primero, luego AEROPARQUE
        // Priorizar EZEIZA ya que tiene tarifas más altas para las mismas zonas
        if (tablaPrecios['EZEIZA'] && tablaPrecios['EZEIZA'].subzonas && tablaPrecios['EZEIZA'].subzonas[zonaDestino]) {
            precioDestino = tablaPrecios['EZEIZA'].subzonas[zonaDestino][tipoVehiculo];
        } else if (tablaPrecios['AEROPARQUE'] && tablaPrecios['AEROPARQUE'].subzonas && tablaPrecios['AEROPARQUE'].subzonas[zonaDestino]) {
            precioDestino = tablaPrecios['AEROPARQUE'].subzonas[zonaDestino][tipoVehiculo];
        }
    }

    console.log(`Precio Origen: ${precioOrigen}, Precio Destino: ${precioDestino}`);

    if (precioOrigen !== null && precioDestino !== null) {
        return Math.max(precioOrigen, precioDestino);
    }
    if (precioOrigen !== null) return precioOrigen;
    if (precioDestino !== null) return precioDestino;

    return null;
}

// Variable para rastrear si la burbuja ya ha mostrado un precio válido
let burbujaMostrada = false;

// Función para mostrar el precio en el formulario
async function mostrarPrecio() {
    const origenInput = document.getElementById('origen');
    const destinoInput = document.getElementById('destino');
    const maletasInput = document.getElementById('maletas');
    const equipajeCheckbox = document.getElementById('equipaje');
    let precioContainer = document.getElementById('precioContainer');

    // Si no existe el contenedor de precio, crearlo
    if (!precioContainer) {
        const precioDiv = document.createElement('div');
        precioDiv.id = 'precioContainer';
        precioDiv.className = 'precio-container';
        precioDiv.innerHTML = `
            <div class="precio-header">
                <h3>Precio Estimado</h3>
            </div>
            <div class="precio-valor" id="precioValor">-</div>
            <div class="precio-detalle" id="precioDetalle">Ingrese origen y destino</div>
        `;

        // Agregar al body para que no modifique el layout
        document.body.appendChild(precioDiv);
        precioContainer = precioDiv;
        
        // Hacer visible la burbuja desde el principio
        precioContainer.classList.add('visible');
    }

    const origen = origenInput.value;
    const destino = destinoInput.value;

    // Mostrar estado de carga solo si ambos campos tienen contenido significativo
    if (origen.length > 3 && destino.length > 3) {
        // Solo mostrar "Calculando..." si realmente vamos a calcular un precio
        // Verificar si tenemos datos suficientes para calcular
        const origenDetails = origenInput.dataset.address ? JSON.parse(origenInput.dataset.address) : null;
        const destinoDetails = destinoInput.dataset.address ? JSON.parse(destinoInput.dataset.address) : null;
        
        // Si tenemos datos cacheados o direcciones completas, mostrar "Calculando..."
        if (origenDetails || destinoDetails || 
            (origen.includes(',') && destino.includes(','))) {
            document.getElementById('precioValor').textContent = 'Calculando...';
            document.getElementById('precioDetalle').textContent = '';
        }
    }

    let numMaletas = 0;
    let tieneEquipaje = false;

    if (equipajeCheckbox && equipajeCheckbox.checked) {
        numMaletas = parseInt(maletasInput.value) || 0;
        tieneEquipaje = true;
    }

    // Obtener detalles cacheados
    const origenDetails = origenInput.dataset.address ? JSON.parse(origenInput.dataset.address) : null;
    const destinoDetails = destinoInput.dataset.address ? JSON.parse(destinoInput.dataset.address) : null;

    try {
        const precio = await calcularPrecio(origen, destino, numMaletas, origenDetails, destinoDetails);

        const precioValor = document.getElementById('precioValor');
        const precioDetalle = document.getElementById('precioDetalle');

        if (precio && precio > 0) {
            precioValor.textContent = `$${precio.toLocaleString('es-AR')}`;
            if (tieneEquipaje) {
                precioDetalle.textContent = `${numMaletas > 3 ? 'Kangoo' : 'Urbano'} (${numMaletas} maletas)`;
            } else {
                precioDetalle.textContent = 'Precio base (Sin equipaje)';
            }
            
            // Marcar que la burbuja ya ha mostrado un precio válido
            burbujaMostrada = true;
        } else {
            // Solo mostrar mensaje inicial si la burbuja nunca ha mostrado un precio
            if (!burbujaMostrada) {
                if (!origen && !destino) {
                    precioValor.textContent = '-';
                    precioDetalle.textContent = 'Ingrese origen y destino';
                }
            } else {
                // Si ya se mostró un precio, mantener el último precio o mostrar mensaje de cálculo
                if (origen.length > 3 && destino.length > 3) {
                    // Verificar si tenemos datos suficientes para calcular
                    const origenDetails = origenInput.dataset.address ? JSON.parse(origenInput.dataset.address) : null;
                    const destinoDetails = destinoInput.dataset.address ? JSON.parse(destinoInput.dataset.address) : null;
                    
                    // Solo mostrar "Calculando..." si realmente vamos a calcular un precio
                    if (origenDetails || destinoDetails || 
                        (origen.includes(',') && destino.includes(','))) {
                        precioValor.textContent = 'Calculando...';
                        precioDetalle.textContent = '';
                    } else {
                        // Si no tenemos datos suficientes, mantener el último precio mostrado
                        // o mostrar un mensaje más informativo
                        if (precioValor.textContent === 'Calculando...') {
                            precioValor.textContent = '-';
                            precioDetalle.textContent = 'Complete ambos campos para calcular precio';
                        }
                    }
                } else {
                    // Si uno de los campos está vacío, mostrar mensaje inicial
                    precioValor.textContent = '-';
                    precioDetalle.textContent = 'Ingrese origen y destino';
                }
            }
        }
    } catch (error) {
        console.error('Error al calcular precio:', error);
        
        // Mantener la burbuja visible incluso si hay error
        if (burbujaMostrada) {
            const precioValor = document.getElementById('precioValor');
            const precioDetalle = document.getElementById('precioDetalle');
            
            // Mantener el último precio mostrado o mostrar mensaje de error
            if (precioValor.textContent === '-' || precioValor.textContent === 'Calculando...') {
                precioDetalle.textContent = 'Error al calcular precio';
            }
        } else {
            // Si nunca se mostró un precio, mostrar mensaje de error
            const precioValor = document.getElementById('precioValor');
            const precioDetalle = document.getElementById('precioDetalle');
            precioValor.textContent = '-';
            precioDetalle.textContent = 'Error al calcular precio';
        }
    }
}

// Función para buscar lugares comunes que coincidan
function searchLugaresComunes(query, lugaresComunes) {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return lugaresComunes.filter(lugar => 
        lugar.nombre.toLowerCase().includes(searchTerm)
    );
}

// Función para verificar si una dirección está en el área permitida
function isDireccionPermitida(direccion) {
    const direccionLower = direccion.toLowerCase();
    
    // Partidos y localidades permitidos (área metropolitana de Buenos Aires)
    const partidosPermitidos = [
        "buenos aires", "ciudad autónoma de buenos aires", "caba",
        "quilmes", "bernal", "wilde", "lanús", "lomas de zamora", 
        "adrogué", "monte grande", "ezeiza", "san justo", "ramos mejía",
        "morón", "caseros", "hurlingham", "san martín", "villa ballester",
        "olivos", "martínez", "san isidro", "vicente lópez"
    ];
    
    // Verificar si alguna de las localidades permitidas está en la dirección
    return partidosPermitidos.some(partido => 
        direccionLower.includes(partido.toLowerCase())
    );
}

// Variable global para caché de búsquedas
const searchCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Función para buscar lugares comunes que coincidan
function searchLugaresComunes(query, lugaresComunes) {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    // Usar búsqueda más eficiente con indexOf en lugar de includes
    return lugaresComunes.filter(lugar => 
        lugar.nombre.toLowerCase().indexOf(searchTerm) !== -1
    );
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

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            try {
                // Buscar lugares comunes primero
                const lugares = searchLugaresComunes(query, lugaresComunes);
                
                // Si encontramos lugares comunes, mostrar solo esos (prioridad alta)
                if (lugares.length > 0) {
                    const results = lugares.map(lugar => ({
                        display_name: lugar.nombre,
                        address: lugar.direccion,
                        isCommonPlace: true
                    }));
                    
                    displaySuggestions(results);
                    return;
                }
                
                // Verificar si tenemos resultados en cache
                const cacheKey = query.toLowerCase();
                const cachedResult = searchCache.get(cacheKey);
                const now = Date.now();
                
                if (cachedResult && (now - cachedResult.timestamp) < CACHE_TTL) {
                    console.log('Usando resultados de cache para:', query);
                    let locationResults = cachedResult.data;
                    
                    // Filtrar resultados por área permitida
                    locationResults = locationResults.filter(item => 
                        isDireccionPermitida(item.display_name)
                    );
                    
                    // Tomar solo los primeros 5 resultados
                    locationResults = locationResults.slice(0, 5);
                    
                    // Convertir resultados al mismo formato
                    const formattedResults = locationResults.map(result => ({
                        display_name: result.display_name,
                        address: result.address || {},
                        lat: result.lat,
                        lon: result.lon,
                        isCommonPlace: false
                    }));
                    
                    // Mostrar resultados
                    if (formattedResults.length > 0) {
                        displaySuggestions(formattedResults);
                    } else {
                        suggestionsContainer.style.display = 'none';
                    }
                    return;
                }
                
                // Buscar en LocationIQ solo si no hay lugares comunes
                let locationResults = [];
                try {
                    // Usar LocationIQ API para autocompletado
                    const locationIQUrl = `https://api.locationiq.com/v1/autocomplete.php?key=pk.6234567b586b647771556a706d6e446e626a676e64694c6e626a676e&q=${encodeURIComponent(query)}&limit=5&countrycodes=AR`;
                    
                    // Lista de proxies alternativos (actualizada para evitar errores 401)
                    const proxies = [
                        'https://api.codetabs.com/v1/proxy?quest=',
                        'https://corsproxy.io/?'
                    ];
                    
                    // Probar diferentes proxies en orden
                    let response;
                    let lastError;
                    
                    for (const proxy of proxies) {
                        try {
                            const proxyUrl = proxy + encodeURIComponent(locationIQUrl);
                            console.log(`Intentando con proxy para LocationIQ: ${proxy}`);
                            
                            response = await fetch(proxyUrl);
                            
                            if (response.ok) {
                                console.log(`Éxito con proxy para LocationIQ: ${proxy}`);
                                break;
                            } else {
                                console.log(`Error con proxy ${proxy} para LocationIQ: ${response.status}`);
                                lastError = new Error(`HTTP error! status: ${response.status}`);
                            }
                        } catch (proxyError) {
                            console.log(`Error con proxy ${proxy} para LocationIQ:`, proxyError);
                            lastError = proxyError;
                        }
                    }
                    
                    // Si ninguno de los proxies funcionó, lanzar el último error
                    if (!response || !response.ok) {
                        throw lastError || new Error('Todos los proxies fallaron para LocationIQ');
                    }
                    
                    const rawData = await response.json();
                    
                    // Convertir datos de LocationIQ al formato esperado
                    locationResults = rawData.map(item => ({
                        display_name: item.display_name,
                        address: {
                            house_number: item.address?.house_number,
                            road: item.address?.road,
                            neighbourhood: item.address?.neighbourhood,
                            suburb: item.address?.suburb,
                            city: item.address?.city,
                            town: item.address?.town,
                            municipality: item.address?.municipality,
                            county: item.address?.county,
                            state: item.address?.state,
                            postcode: item.address?.postcode,
                            country: item.address?.country
                        },
                        lat: item.lat,
                        lon: item.lon
                    }));
                    
                    // Guardar en cache
                    searchCache.set(cacheKey, {
                        data: locationResults,
                        timestamp: now
                    });
                } catch (error) {
                    console.error('Error fetching LocationIQ suggestions:', error);
                    // En caso de error, continuar con array vacío
                    locationResults = [];
                }

                // Filtrar resultados por área permitida
                locationResults = locationResults.filter(item => 
                    isDireccionPermitida(item.display_name)
                );
                
                // Tomar solo los primeros 5 resultados
                locationResults = locationResults.slice(0, 5);
                
                // Convertir resultados al mismo formato
                const formattedResults = locationResults.map(result => ({
                    display_name: result.display_name,
                    address: result.address,
                    lat: result.lat,
                    lon: result.lon,
                    isCommonPlace: false
                }));
                
                // Mostrar resultados
                if (formattedResults.length > 0) {
                    displaySuggestions(formattedResults);
                } else {
                    suggestionsContainer.style.display = 'none';
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                suggestionsContainer.style.display = 'none';
            }
        }, 1000); // Reducir el tiempo de debounce a 1000ms
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
                    // Para resultados de LocationIQ, formatear la dirección
                    const parts = [];
                    if (result.address.road) parts.push(result.address.road);
                    if (result.address.house_number) parts.push(result.address.house_number);
                    if (result.address.neighbourhood) parts.push(result.address.neighbourhood);
                    if (result.address.city || result.address.town || result.address.municipality) {
                        parts.push(result.address.city || result.address.town || result.address.municipality);
                    }
                    if (result.address.postcode) parts.push(result.address.postcode);
                    
                    if (parts.length > 0) {
                        displayText = parts.join(', ');
                    }
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
                    
                    input.value = result.display_name;
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

    async function actualizarPrecio() {
        await mostrarPrecio();
    }

    if (origenInput) origenInput.addEventListener('input', actualizarPrecio);
    if (destinoInput) destinoInput.addEventListener('input', actualizarPrecio);
    if (maletasInput) maletasInput.addEventListener('input', actualizarPrecio);

    if (equipajeCheckbox) {
        // Remover cualquier listener previo para evitar duplicados
        const toggleLuggageSection = function () {
            const luggageDetails = document.getElementById('luggageDetails');
            if (this.checked) {
                luggageDetails.classList.add('active');
            } else {
                luggageDetails.classList.remove('active');
            }
            mostrarPrecio();
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