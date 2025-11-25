// Tabla de precios por zonas
const tablaPrecios = {
    // HACIA / DESDE EZEIZA o Aeroparque
    'CABA / Aeroparque': {
        urbano: 49900,
        kangoo: 65900
    },
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
    'CABA / Aeroparque': { min: 1000, max: 1499 },
    'Avellaneda / Lanús': [1870, 1871, 1872, 1873, 1874, 1875, 1822, 1824],
    'Wilde / Monte Chingolo': [1875, 1826],
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
        return 'CABA / Aeroparque';
    }

    return null;
}

// Función para determinar la zona según el origen o destino
async function determinarZona(direccion, cachedDetails = null) {
    // 0. Usar detalles cacheados si existen (Optimización)
    if (cachedDetails) {
        console.log('Usando detalles de dirección cacheados');
        const zona = determinarZonaFromDetails(cachedDetails);
        if (zona) return zona;
    }

    // 1. Intentar extraer CP directamente del texto
    const cpRegex = /\b([a-zA-Z])\s*(\d{4})(?:[a-zA-Z]{3})?\b/g;
    let match;

    while ((match = cpRegex.exec(direccion)) !== null) {
        const cp = parseInt(match[2]);
        if (cp >= 1000 && cp <= 9999) {
            const zonaCP = determinarZonaPorCP(cp);
            if (zonaCP) {
                console.log(`Zona determinada por CP extraído del texto (${cp}): ${zonaCP}`);
                return zonaCP;
            }
        }
    }

    // 2. Intentar con coincidencias de texto
    const zonaTexto = determinarZonaPorTexto(direccion);
    if (zonaTexto) {
        return zonaTexto;
    }

    // 3. Si no se encuentra por texto, buscar con Nominatim
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(direccion)}&` +
            `format=json&` +
            `countrycodes=AR&` +
            `limit=1&` +
            `addressdetails=1`
        );

        const results = await response.json();

        if (results && results.length > 0) {
            const result = results[0];
            const address = result.address;
            console.log('Nominatim result:', address);

            const zona = determinarZonaFromDetails(address);
            if (zona) return zona;
        }
    } catch (error) {
        console.error('Error buscando dirección en Nominatim:', error);
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

    // EZEIZA
    if (dir.includes('ezeiza') || dir.includes('pistarini') || dir.includes('aeropuerto internacional')) {
        return 'EZEIZA';
    }

    // CABA / Aeroparque
    if (dir.includes('caba') || dir.includes('aeroparque') ||
        dir.includes('ciudad autónoma') || dir.includes('ciudad autonoma') ||
        dir.includes('capital federal') ||
        dir.includes('palermo') ||
        dir.includes('recoleta') || dir.includes('san telmo') ||
        dir.includes('la boca') || dir.includes('microcentro') ||
        dir.includes('puerto madero') || dir.includes('centro cívico') ||
        dir.includes('colegiales') || dir.includes('belgrano') ||
        dir.includes('nuñez') || dir.includes('saavedra') ||
        dir.includes('villa urquiza') || dir.includes('villa crespo') ||
        dir.includes('almagro') || dir.includes('caballito')) {
        return 'CABA / Aeroparque';
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

    const usarKangoo = numMaletas > 3;
    const tipoVehiculo = usarKangoo ? 'kangoo' : 'urbano';
    console.log(`Tipo Vehículo: ${tipoVehiculo}`);

    let precioOrigen = null;
    let precioDestino = null;

    // Buscar precio para el origen
    if (tablaPrecios[zonaOrigen]) {
        precioOrigen = tablaPrecios[zonaOrigen][tipoVehiculo];
        if (precioOrigen === 0 && tablaPrecios[zonaOrigen].subzonas) {
            const subzonaOrigen = await determinarZona(origen, origenDetails);
            if (tablaPrecios[zonaOrigen].subzonas[subzonaOrigen]) {
                precioOrigen = tablaPrecios[zonaOrigen].subzonas[subzonaOrigen][tipoVehiculo];
            }
        }
    } else {
        for (const zona in tablaPrecios) {
            if (tablaPrecios[zona].subzonas && tablaPrecios[zona].subzonas[zonaOrigen]) {
                precioOrigen = tablaPrecios[zona].subzonas[zonaOrigen][tipoVehiculo];
                break;
            }
        }
    }

    // Buscar precio para el destino
    if (tablaPrecios[zonaDestino]) {
        precioDestino = tablaPrecios[zonaDestino][tipoVehiculo];
        if (precioDestino === 0 && tablaPrecios[zonaDestino].subzonas) {
            const subzonaDestino = await determinarZona(destino, destinoDetails);
            if (tablaPrecios[zonaDestino].subzonas[subzonaDestino]) {
                precioDestino = tablaPrecios[zonaDestino].subzonas[subzonaDestino][tipoVehiculo];
            }
        }
    } else {
        for (const zona in tablaPrecios) {
            if (tablaPrecios[zona].subzonas && tablaPrecios[zona].subzonas[zonaDestino]) {
                precioDestino = tablaPrecios[zona].subzonas[zonaDestino][tipoVehiculo];
                break;
            }
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

// Función para mostrar el precio en el formulario
async function mostrarPrecio() {
    const origenInput = document.getElementById('origen');
    const destinoInput = document.getElementById('destino');
    const maletasInput = document.getElementById('maletas');
    const equipajeCheckbox = document.getElementById('equipaje');
    let precioContainer = document.getElementById('precioContainer');

    // Si no existe el contenedor de precio, crearlo
    if (!precioContainer) {
        const heroContent = document.querySelector('.hero-content');

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

        // Insertar después del formulario de reserva
        if (heroContent) {
            heroContent.appendChild(precioDiv);
        }
        precioContainer = precioDiv;

        const style = document.createElement('style');
        style.textContent = `
            .hero-content {
                grid-template-columns: 1fr 1fr 400px !important;
                gap: 40px !important;
            }
            
            .precio-container {
                background: linear-gradient(135deg, #f5f8fc 0%, #e8f0f8 100%);
                padding: 35px;
                border-radius: 25px;
                box-shadow: 0 20px 60px rgba(59, 89, 152, 0.15);
                border: 1px solid rgba(91, 141, 184, 0.1);
                position: sticky;
                top: 70px;
                height: fit-content;
                transition: all 0.3s ease;
            }
            
            .precio-header h3 {
                font-size: 1.5em;
                background: linear-gradient(135deg, #2C4A7C, #3B5998);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .precio-valor {
                font-size: 3em;
                font-weight: 700;
                background: linear-gradient(135deg, #3B5998, #5B8DB8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-align: center;
                margin: 20px 0;
            }
            
            .precio-detalle {
                font-size: 1em;
                color: #5B8DB8;
                text-align: center;
                font-weight: 500;
            }
            
            /* Responsive para tablets y móviles */
            @media (max-width: 1200px) {
                .hero-content {
                    grid-template-columns: 1fr 1fr !important;
                    gap: 40px !important;
                }
                
                .precio-container {
                    grid-column: 1 / -1;
                    position: relative;
                    top: 0;
                    margin-top: 30px;
                }
            }
            
            @media (max-width: 768px) {
                .hero-content {
                    grid-template-columns: 1fr !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    const origen = origenInput.value;
    const destino = destinoInput.value;

    // Mostrar estado de carga
    if (origen.length > 3 && destino.length > 3) {
        document.getElementById('precioValor').textContent = 'Calculando...';
        document.getElementById('precioDetalle').textContent = '';
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
        } else {
            if (!origen && !destino) {
                precioValor.textContent = '-';
                precioDetalle.textContent = 'Ingrese origen y destino';
            }
        }
    } catch (error) {
        console.error('Error al calcular precio:', error);
    }
}

// Función para configurar el autocompletado
function setupAutocomplete(inputId, suggestionsId) {
    const input = document.getElementById(inputId);
    let suggestionsContainer = document.getElementById(suggestionsId);
    let debounceTimer;
    let isSelectingSuggestion = false; // Flag para evitar reabrir la lista al seleccionar

    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = suggestionsId;
        suggestionsContainer.className = 'autocomplete-suggestions';
        input.parentNode.appendChild(suggestionsContainer);
    }

    input.addEventListener('input', function () {
        // Si estamos seleccionando una sugerencia, no hacer nada
        if (isSelectingSuggestion) {
            isSelectingSuggestion = false;
            return;
        }

        const query = this.value;

        // Limpiar cache si el usuario edita manualmente
        delete input.dataset.address;

        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';

        if (query.length < 3) return;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?` +
                    `q=${encodeURIComponent(query)}&` +
                    `format=json&` +
                    `countrycodes=AR&` +
                    `limit=5&` +
                    `addressdetails=1`
                );

                const results = await response.json();

                if (results.length > 0) {
                    suggestionsContainer.style.display = 'block';

                    results.forEach(result => {
                        const div = document.createElement('div');
                        div.className = 'autocomplete-item';

                        let displayText = result.display_name;
                        if (result.address) {
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

                        div.addEventListener('click', function () {
                            // Activar flag antes de cambiar el valor
                            isSelectingSuggestion = true;

                            input.value = displayText;
                            // Cachear detalles de la dirección
                            input.dataset.address = JSON.stringify(result.address);

                            suggestionsContainer.style.display = 'none';
                            suggestionsContainer.innerHTML = '';

                            // Disparar evento input para actualizar precio
                            input.dispatchEvent(new Event('input'));
                        });

                        suggestionsContainer.appendChild(div);
                    });
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        }, 500);
    });

    document.addEventListener('click', function (e) {
        if (e.target !== input && e.target !== suggestionsContainer) {
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

    setupAutocomplete('origen', 'origen-suggestions');
    setupAutocomplete('destino', 'destino-suggestions');

    async function actualizarPrecio() {
        await mostrarPrecio();
    }

    if (origenInput) origenInput.addEventListener('input', actualizarPrecio);
    if (destinoInput) destinoInput.addEventListener('input', actualizarPrecio);
    if (maletasInput) maletasInput.addEventListener('input', actualizarPrecio);

    if (equipajeCheckbox) {
        const originalChangeHandler = function () {
            if (this.checked) {
                document.getElementById('luggageDetails').classList.add('active');
            } else {
                document.getElementById('luggageDetails').classList.remove('active');
            }
            mostrarPrecio();
        };

        equipajeCheckbox.removeEventListener('change', originalChangeHandler);
        equipajeCheckbox.addEventListener('change', originalChangeHandler);
    }
});