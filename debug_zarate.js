// Native fetch is available in Node 18+

// Mock tables and functions
const tablaPrecios = {
    'CABA / Aeroparque': { urbano: 49900, kangoo: 65900 },
    'ZONA NORTE': {
        subzonas: {
            'Villa Ballester / José León Suárez': { urbano: 65000, kangoo: 79000 }
        }
    }
};

function determinarZonaPorTexto(direccion) {
    const dir = direccion.toLowerCase();
    if (dir.includes('caba') || dir.includes('buenos aires')) return 'CABA / Aeroparque';
    return null;
}

function determinarZonaPorCP(cp) {
    if (!cp) return null;
    if (cp >= 1000 && cp <= 1499) return 'CABA / Aeroparque';
    if ([1653, 1655].includes(cp)) return 'Villa Ballester / José León Suárez';
    return null;
}

async function determinarZona(direccion) {
    console.log(`Testing address: "${direccion}"`);

    const zonaTexto = determinarZonaPorTexto(direccion);
    if (zonaTexto) {
        console.log(`Matched by text: ${zonaTexto}`);
        return zonaTexto;
    }

    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion)}&format=json&countrycodes=AR&limit=1&addressdetails=1`;
        console.log(`Fetching: ${url}`);
        const response = await fetch(url);
        const results = await response.json();

        if (results && results.length > 0) {
            const result = results[0];
            const address = result.address;
            console.log('Nominatim address:', JSON.stringify(address, null, 2));

            if (address) {
                if (address.road && address.road.includes('Zarate') && address.house_number === '5300') {
                    console.log('Matched by specific Zarate check');
                    return 'Villa Ballester / José León Suárez';
                }

                if (address.postcode) {
                    const cp = parseInt(address.postcode.replace(/\D/g, ''));
                    console.log(`Checking CP: ${cp}`);
                    const zonaCP = determinarZonaPorCP(cp);
                    if (zonaCP) {
                        console.log(`Matched by CP: ${zonaCP}`);
                        return zonaCP;
                    }
                }

                // ... other checks ...
                if (address.city === 'Buenos Aires' || address.state === 'Ciudad Autónoma de Buenos Aires') {
                    console.log('Matched by CABA check');
                    return 'CABA / Aeroparque';
                }
            }
        } else {
            console.log('No results from Nominatim');
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
}

// Run tests
async function run() {
    await determinarZona('Zarate 5300');
    console.log('---');
    await determinarZona('Zarate 5300, B1653');
}

run();
