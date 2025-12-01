// Test para diagnosticar el problema de autocompletado
console.log('=== Test de diagnóstico para autocompletado ===');

// Simular el input del usuario
const userInput = 'Zárate 5300';
console.log('Input del usuario:', userInput);

// Verificar si el texto parece una dirección completa
const hasStreetAndNumber = /\d/.test(userInput) && userInput.length >= 6;
console.log('¿Tiene calle y número?', hasStreetAndNumber);

// Verificar la longitud
console.log('Longitud del input:', userInput.length);

// Verificar si pasa los filtros actuales
if (userInput.length < 3) {
    console.log('Demasiado corto: Menos de 3 caracteres');
} else if (userInput.length < 4) {
    console.log('Demasiado corto: Menos de 4 caracteres');
} else if (!hasStreetAndNumber) {
    console.log('No parece una dirección completa: Sin número o muy corto');
} else {
    console.log('Pasa todos los filtros, debería hacer la búsqueda');
}

// Simular la división de zonas compuestas
const zonaSeleccionada = 'Villa Ballester / José León Suárez';
console.log('Zona seleccionada:', zonaSeleccionada);

if (zonaSeleccionada.includes(' / ')) {
    const partes = zonaSeleccionada.split(' / ');
    console.log('Partes de la zona:', partes);
}

// Test de filtrado
const testResults = [
    {
        properties: {
            formatted: 'Zárate 5300, Villa Ballester, Buenos Aires',
            city: 'Villa Ballester',
            state: 'Buenos Aires'
        }
    },
    {
        properties: {
            formatted: 'Zárate 5300, Moreno, Buenos Aires',
            city: 'Moreno',
            state: 'Buenos Aires'
        }
    },
    {
        properties: {
            formatted: 'Zárate 5300, Villa Mascarel, San Juan',
            city: 'Villa Mascarel',
            state: 'San Juan'
        }
    }
];

console.log('\n=== Test de filtrado ===');
testResults.forEach((item, index) => {
    const addressText = `${item.properties?.formatted || ''} ${item.properties?.city || ''} ${item.properties?.state || ''}`.toLowerCase();
    const partes = zonaSeleccionada.split(' / ');
    const isInZone = partes.some(parte => addressText.includes(parte.toLowerCase()));
    
    console.log(`Resultado ${index + 1}:`);
    console.log('  Dirección:', item.properties.formatted);
    console.log('  Ciudad:', item.properties.city);
    console.log('  Provincia:', item.properties.state);
    console.log('  ¿En zona correcta?', isInZone);
    console.log('  Texto de dirección:', addressText);
});