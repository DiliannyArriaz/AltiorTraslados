const ZONAS_CP = {
    'CABA / Aeroparque': { min: 1000, max: 1499 },
    'Villa Ballester / José León Suárez': ['B1653', 'B1655'],
};

function determinarZonaPorCP(cp) {
    if (!cp) return null;

    for (const [zona, codigos] of Object.entries(ZONAS_CP)) {
        if (codigos.min && codigos.max) {
            if (cp >= codigos.min && cp <= codigos.max) {
                return zona;
            }
        } else if (Array.isArray(codigos)) {
            const match = codigos.some(codigo => {
                const numCodigo = parseInt(String(codigo).replace(/\D/g, ''));
                return numCodigo === cp;
            });
            if (match) return zona;
        }
    }
    return null;
}

function extractAndTest(direccion) {
    // Strict Regex: Requires a letter prefix
    // Matches: B1653, C1000, A1234, C1425AAA
    // Does NOT match: 1653, 1234 (to avoid street numbers)
    const cpRegex = /\b([a-zA-Z])\s*(\d{4})(?:[a-zA-Z]{3})?\b/g;

    let match;
    console.log(`Testing: "${direccion}"`);
    let found = false;
    while ((match = cpRegex.exec(direccion)) !== null) {
        const letter = match[1];
        const cp = parseInt(match[2]);
        console.log(`  Found candidate: ${letter}${cp}`);

        if (cp >= 1000 && cp <= 9999) {
            const zona = determinarZonaPorCP(cp);
            if (zona) {
                console.log(`  -> MATCH: ${zona}`);
                found = true;
            }
        }
    }
    if (!found) console.log("  -> NO MATCH");
    console.log("---");
}

extractAndTest("Av. Santa Fe 1234"); // Should NOT match (street number)
extractAndTest("Av. Santa Fe 1234, C1000"); // Should match 1000 (CABA)
extractAndTest("C1000AAA"); // Should match 1000
extractAndTest("Calle Falsa 123, B1653"); // Should match 1653 (Villa Ballester)
extractAndTest("Zarate 5300"); // Should NOT match (street number)
extractAndTest("Zarate B1653"); // Should match 1653
