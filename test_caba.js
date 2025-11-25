const ZONAS_CP = {
    'CABA / Aeroparque': { min: 1000, max: 1499 },
};

function determinarZonaPorCP(cp) {
    if (!cp) return null;

    for (const [zona, codigos] of Object.entries(ZONAS_CP)) {
        if (codigos.min && codigos.max) {
            if (cp >= codigos.min && cp <= codigos.max) {
                return zona;
            }
        }
    }
    return null;
}

function extractAndTest(direccion) {
    // Current Regex
    // const cpRegex = /\b(?:[a-zA-Z]?\s*)?(\d{4})\b/g;

    // Proposed Regex
    const cpRegex = /\b(?:[a-zA-Z]\s*)?(\d{4})(?:[a-zA-Z]{3})?\b/g;

    let match;
    console.log(`Testing: "${direccion}"`);
    let found = false;
    while ((match = cpRegex.exec(direccion)) !== null) {
        const cp = parseInt(match[1]);
        console.log(`  Found candidate: ${cp}`);
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

extractAndTest("Av. Santa Fe 1234"); // Should match 1234 (CABA)
extractAndTest("Av. Santa Fe 1234, CABA"); // Should match 1234
extractAndTest("C1000AAA"); // Should match 1000
extractAndTest("Calle Falsa 123, C1425AAA"); // Should match 1425
extractAndTest("B1653"); // Should NOT match CABA (it's 1653)
