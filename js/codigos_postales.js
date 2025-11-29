// Mapeo de Zonas por Código Postal
const ZONAS_CP = {
    'CABA / Aeroparque': { min: 1000, max: 1499 },

    // ZONA SUR
    'Avellaneda / Lanús': ['B1822', 'B1824', 'B1825',
    'B1869',
    'B1870', 'B1871', 'B1872', 'B1874', 'B1875', 'B1876'],
    'Wilde / Monte Chingolo': ['B1875', 'B1825', 'B1824', 'B1822'],
    'Quilmes / Alte Brown': [
    'B1878', 'B1879',
    'B1846', 'B1852', 'B1847', 'B1849'],
    'Berazategui / Hudson': ['B1880', 'B1884', 'B1885', 'B1886'],
    'Lomas de Zamora': ['B1832', 'B1828', 'B1834'],
    'Canning / Spegazzini': ['B1804', 'B1812'],
    'La Plata': ['B1900', 'B1897', 'B1896', 'B1906'],

    // ZONA OESTE
    'Ramos Mejía / Ciudadela': ['B1704', 'B1702'],
    'Morón / Haedo': ['B1708', 'B1706'],
    'Caseros / El Palomar': ['B1678', 'B1684'],
    'Hurlingham / Loma Hermosa': [ 'B1686', 'B1657'],
    'Ituzaingó / Padua': [ 'B1714', 'B1718'],
    'San Miguel / José C. Paz': [ 'B1663', 'B1665'],
    'Merlo / Paso del Rey': ['B1722', 'B1742'],
    'Moreno / Francisco Álvarez': ['B1744', 'B1746'],
    'Gral. Rodríguez': ['B1748'],
    'Luján': ['B6700'],

    // ZONA NORTE
    'Vicente López / Olivos': [ 'B1636', 'B1638', 'B1602'],
    'San Martín / San Andrés': ['B1650', 'B1651'],
    'San Isidro / Boulogne': ['B1642', 'B1609', 'B1640', 'B1641', 'B1643', 'B1644', 'B1646'],
    'Villa Ballester / José León Suárez': ['B1653', 'B1655', 'B1659'],
    'Tigre Centro / Pacheco': [ 'B1648', 'B1617', 'B1618'],
    'Don Torcuato / Grand Bourg': ['B1611', 'B1615'],
    'Benavídez / Milberg / Tortuguitas': ['B1621', 'B1619', 'B1667'],
    'Ing. Maschwitz / Del Viso': ['B1623', 'B1669'],
    'Pilar / Escobar': ['B1629', 'B1625', 'B1630'],
    'Campana / Cardales': ['B2804', 'B2814']
};

// Función para determinar zona por código postal
function determinarZonaPorCP(cp) {
    // Convertir a número si es string
    if (typeof cp === 'string') {
        // Extraer solo los dígitos
        const match = cp.match(/\d+/);
        if (match) {
            cp = parseInt(match[0]);
        } else {
            return null;
        }
    }
    
    // Verificar que sea un número válido
    if (typeof cp !== 'number' || isNaN(cp)) {
        return null;
    }
    
    // Buscar en todas las zonas
    for (const [zona, codigos] of Object.entries(ZONAS_CP)) {
        // Si es un array de códigos específicos
        if (Array.isArray(codigos)) {
            // Verificar si el código está en el array (como string o como número)
            if (codigos.includes(cp) || codigos.includes(`B${cp}`) || codigos.includes(cp.toString())) {
                return zona;
            }
        }
        // Si es un objeto con rango mínimo y máximo
        else if (typeof codigos === 'object' && codigos.min && codigos.max) {
            if (cp >= codigos.min && cp <= codigos.max) {
                return zona;
            }
        }
    }
    
    // Si no se encuentra en ninguna zona específica, verificar rangos generales
    if (cp >= 1000 && cp <= 1499) {
        return 'CABA / Aeroparque';
    }
    
    // No se pudo determinar la zona
    return null;
}