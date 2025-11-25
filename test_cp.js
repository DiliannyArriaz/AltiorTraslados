const ZONAS_CP = {
    // ZONA NORTE
    'Vicente López / Olivos': ['B1636', 'B1638', 'B1602'],
    'San Martín / San Andrés': ['B1650', 'B1651'],
    'San Isidro / Boulogne': ['B1642', 'B1609', 'B1640', 'B1641', 'B1643', 'B1644', 'B1646'],
    'Villa Ballester / José León Suárez': ['B1653', 'B1655'],
};

function determinarZonaPorCP(cp) {
    if (!cp) return null;

    for (const [zona, codigos] of Object.entries(ZONAS_CP)) {
        // Caso rango (para CABA)
        if (codigos.min && codigos.max) {
            if (cp >= codigos.min && cp <= codigos.max) {
                return zona;
            }
        }
        // Caso array de códigos
        else if (Array.isArray(codigos)) {
            // Comparamos números
            const match = codigos.some(codigo => {
                // Extraer solo dígitos del código en la lista (ej: 'B1653' -> 1653)
                const numCodigo = parseInt(String(codigo).replace(/\D/g, ''));
                return numCodigo === cp;
            });

            if (match) {
                return zona;
            }
        }
    }

    return null;
}

// TEST
const testCP = 1653;
const zona = determinarZonaPorCP(testCP);
console.log(`CP: ${testCP}, Zona: ${zona}`);

const testCP2 = 1650;
const zona2 = determinarZonaPorCP(testCP2);
console.log(`CP: ${testCP2}, Zona: ${zona2}`);
