# Sistema Básico de Determinación de Zonas

Este sistema permite determinar zonas geográficas basándose únicamente en la extracción de códigos postales y una base de datos local, eliminando la necesidad de servicios externos como Nominatim.

## 📋 Características

- **Sin dependencia de servicios externos**: No requiere llamadas a APIs externas
- **Rápido y eficiente**: Procesamiento inmediato de direcciones
- **Base de datos local**: Contiene todos los códigos postales relevantes
- **Priorización de lugares comunes**: Identifica aeropuertos y zonas principales por nombre

## 📁 Archivos incluidos

1. `js/determinar-zona-basica.js` - Sistema principal de determinación de zonas
2. `js/precios.js` - Archivo modificado para usar el sistema básico (opcional)

## 🚀 Cómo usar

### En el navegador:

```javascript
// Importar las funciones necesarias
import { determinarZonaBasica } from './js/determinar-zona-basica.js';

// Ejemplos de uso:
const zona1 = determinarZonaBasica("Amenabar 1149, CABA, C1426AGX");
console.log(zona1); // "CABA"

const zona2 = determinarZonaBasica("Aeropuerto Ezeiza");
console.log(zona2); // "EZEIZA"

const zona3 = determinarZonaBasica("Avellaneda, CP 1870");
console.log(zona3); // "Avellaneda / Lanús"
```

### En Node.js:

```javascript
// Importar las funciones necesarias
const { determinarZonaBasica } = require('./js/determinar-zona-basica.js');

// Ejemplos de uso:
const zona1 = determinarZonaBasica("Amenabar 1149, CABA, C1426AGX");
console.log(zona1); // "CABA"
```

## 🛠 Funciones disponibles

### `determinarZonaBasica(direccion)`
Función principal que determina la zona a partir de una dirección.

**Parámetros:**
- `direccion` (string): Dirección a analizar

**Retorna:**
- String con el nombre de la zona o `null` si no se puede determinar

### `extraerCodigoPostal(direccion)`
Extrae el código postal de una dirección.

**Parámetros:**
- `direccion` (string): Dirección de la cual extraer el código postal

**Retorna:**
- Número con el código postal o `null` si no se encuentra

### `determinarZonaPorCPBasica(cp)`
Determina la zona a partir de un código postal usando la base de datos local.

**Parámetros:**
- `cp` (number): Código postal

**Retorna:**
- String con el nombre de la zona o `null` si no se encuentra

### `determinarZonaPorTextoBasica(direccion)`
Determina la zona a partir de coincidencias de texto en la dirección.

**Parámetros:**
- `direccion` (string): Dirección a analizar

**Retorna:**
- String con el nombre de la zona o `null` si no se encuentra

## 📊 Cobertura de códigos postales

La base de datos local incluye códigos postales para:

- **CABA**: 1000-1499 (todos los códigos)
- **Zona Sur**: Avellaneda, Lanús, Wilde, Monte Chingolo, Quilmes, Berazategui, Lomas de Zamora, Canning, La Plata
- **Zona Oeste**: Ramos Mejía, Morón, Caseros, Hurlingham, Ituzaingó, San Miguel, Merlo, Moreno, Gral. Rodríguez, Luján
- **Zona Norte**: Vicente López, San Martín, San Isidro, Villa Ballester, Tigre, Don Torcuato, Benavídez, Ing. Maschwitz, Pilar, Campana

## 🔄 Integración con el sistema actual

Para usar este sistema en lugar del actual basado en Nominatim:

1. Reemplazar las llamadas a `determinarZona()` con `determinarZonaBasica()`
2. Eliminar las dependencias de proxies y servicios externos
3. Mantener la funcionalidad de lugares comunes y aeropuertos

## ⚠️ Limitaciones

- Solo funciona con direcciones que contengan códigos postales argentinos
- No puede geolocalizar direcciones incompletas sin CP
- La base de datos debe actualizarse manualmente si se agregan nuevas zonas

## 📈 Ventajas

- **Velocidad**: Procesamiento instantáneo
- **Fiabilidad**: Sin errores de red o límites de tasa
- **Costo**: Gratis y sin dependencias de pago
- **Privacidad**: No se envían datos a terceros