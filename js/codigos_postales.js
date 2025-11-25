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
    'Villa Ballester / José León Suárez': ['B1653', 'B1655'],
    'Tigre Centro / Pacheco': [ 'B1648', 'B1617', 'B1618'],
    'Don Torcuato / Grand Bourg': ['B1611', 'B1615'],
    'Benavídez / Milberg / Tortuguitas': ['B1621', 'B1619', 'B1667'],
    'Ing. Maschwitz / Del Viso': ['B1623', 'B1669'],
    'Pilar / Escobar': ['B1629', 'B1625', 'B1630'],
    'Campana / Cardales': ['B2804', 'B2814']
};
