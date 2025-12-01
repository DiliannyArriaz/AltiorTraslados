// Test específico para diagnosticar el problema de autocompletado
console.log('=== Test específico de autocompletado ===');

// Caso 1: Zárate 5300 con zona Villa Ballester / José León Suárez
console.log('\n--- Caso 1: Zárate 5300 ---');
const query1 = 'Zárate 5300';
const zona1 = 'Villa Ballester / José León Suárez';

console.log('Query:', query1);
console.log('Zona seleccionada:', zona1);

// Simular la construcción del texto de búsqueda
let searchText1 = query1;
if (zona1) {
    searchText1 = `${query1}, ${zona1}`;
}
console.log('Texto de búsqueda enviado a Geoapify:', searchText1);

// Simular resultados de Geoapify
const geoapifyResults1 = [
    {
        properties: {
            formatted: '99 - Zárate 5300, Villa Ballester, Buenos Aires',
            city: 'Villa Ballester',
            state: 'Buenos Aires',
            housenumber: '5300',
            street: '99 - Zárate',
            postcode: 'B1653MNY'
        },
        geometry: {
            coordinates: [-58.5285, -34.3456]
        }
    },
    {
        properties: {
            formatted: 'Zárate 5300, Moreno, Buenos Aires',
            city: 'Moreno',
            state: 'Buenos Aires',
            housenumber: '5300',
            street: 'Zárate'
        },
        geometry: {
            coordinates: [-58.79576175, -34.61479095]
        }
    }
];

console.log('\nResultados de Geoapify:');
geoapifyResults1.forEach((result, index) => {
    console.log(`  ${index + 1}. ${result.properties.formatted}`);
});

// Aplicar filtrado
console.log('\nAplicando filtrado...');
const filteredResults1 = geoapifyResults1.filter(item => {
    const displayName = item.properties?.formatted || item.properties?.name;
    
    // Verificar que la dirección esté en Buenos Aires o CABA
    const state = item.properties?.state || '';
    const city = item.properties?.city || '';
    const isInBA = state.toLowerCase().includes('buenos aires') || city.toLowerCase().includes('buenos aires') || city.toLowerCase().includes('caba') || city.toLowerCase().includes('capital federal');
    
    console.log(`  Resultado ${displayName}: ¿En BA/CABA? ${isInBA}`);
    
    if (!isInBA) return false;
    
    // Verificar que el resultado esté en la zona seleccionada
    if (zona1) {
        if (zona1.includes(' / ')) {
            const partes = zona1.split(' / ');
            const addressText = `${item.properties?.formatted || ''} ${item.properties?.city || ''} ${item.properties?.state || ''}`.toLowerCase();
            
            const isInZone = partes.some(parte => addressText.includes(parte.toLowerCase()));
            console.log(`    ¿En zona "${zona1}"? ${isInZone}`);
            return isInZone;
        } else {
            const addressText = `${item.properties?.formatted || ''} ${item.properties?.city || ''} ${item.properties?.state || ''}`.toLowerCase();
            const isInZone = addressText.includes(zona1.toLowerCase());
            console.log(`    ¿En zona "${zona1}"? ${isInZone}`);
            return isInZone;
        }
    }
    
    return true;
});

console.log('\nResultados después de filtrar:');
if (filteredResults1.length > 0) {
    filteredResults1.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.properties.formatted}`);
    });
} else {
    console.log('  No hay resultados');
}

// Caso 2: Amenabar 1158 con zona CABA
console.log('\n\n--- Caso 2: Amenabar 1158 ---');
const query2 = 'Amenabar 1158';
const zona2 = 'CABA';

console.log('Query:', query2);
console.log('Zona seleccionada:', zona2);

// Simular la construcción del texto de búsqueda
let searchText2 = query2;
if (zona2) {
    searchText2 = `${query2}, ${zona2}`;
}
console.log('Texto de búsqueda enviado a Geoapify:', searchText2);

// Simular resultados de Geoapify
const geoapifyResults2 = [
    {
        properties: {
            formatted: 'Amenábar 1158, CABA, Buenos Aires',
            city: 'CABA',
            state: 'Buenos Aires',
            housenumber: '1158',
            street: 'Amenábar',
            postcode: 'B1425'
        },
        geometry: {
            coordinates: [-58.4452, -34.5887]
        }
    },
    {
        properties: {
            formatted: 'Amenábar 1158, Palermo, CABA, Buenos Aires',
            city: 'CABA',
            state: 'Buenos Aires',
            housenumber: '1158',
            street: 'Amenábar'
        },
        geometry: {
            coordinates: [-58.4452, -34.5887]
        }
    }
];

console.log('\nResultados de Geoapify:');
geoapifyResults2.forEach((result, index) => {
    console.log(`  ${index + 1}. ${result.properties.formatted}`);
});

// Aplicar filtrado
console.log('\nAplicando filtrado...');
const filteredResults2 = geoapifyResults2.filter(item => {
    const displayName = item.properties?.formatted || item.properties?.name;
    
    // Verificar que la dirección esté en Buenos Aires o CABA
    const state = item.properties?.state || '';
    const city = item.properties?.city || '';
    const isInBA = state.toLowerCase().includes('buenos aires') || city.toLowerCase().includes('buenos aires') || city.toLowerCase().includes('caba') || city.toLowerCase().includes('capital federal');
    
    console.log(`  Resultado ${displayName}: ¿En BA/CABA? ${isInBA}`);
    
    if (!isInBA) return false;
    
    // Verificar que el resultado esté en la zona seleccionada
    if (zona2) {
        if (zona2.includes(' / ')) {
            const partes = zona2.split(' / ');
            const addressText = `${item.properties?.formatted || ''} ${item.properties?.city || ''} ${item.properties?.state || ''}`.toLowerCase();
            
            const isInZone = partes.some(parte => addressText.includes(parte.toLowerCase()));
            console.log(`    ¿En zona "${zona2}"? ${isInZone}`);
            return isInZone;
        } else {
            const addressText = `${item.properties?.formatted || ''} ${item.properties?.city || ''} ${item.properties?.state || ''}`.toLowerCase();
            const isInZone = addressText.includes(zona2.toLowerCase());
            console.log(`    ¿En zona "${zona2}"? ${isInZone}`);
            return isInZone;
        }
    }
    
    return true;
});

console.log('\nResultados después de filtrar:');
if (filteredResults2.length > 0) {
    filteredResults2.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.properties.formatted}`);
    });
} else {
    console.log('  No hay resultados');
}

// Verificar la función de displaySuggestions
console.log('\n\n--- Verificando displaySuggestions ---');
if (filteredResults1.length > 0) {
    console.log('Se llamaría a displaySuggestions con:', filteredResults1.length, 'resultados');
} else {
    console.log('No se llamaría a displaySuggestions porque no hay resultados');
}