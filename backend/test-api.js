// Script de prueba para verificar la API
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
    const baseURL = 'https://altiortraslados.onrender.com';
    
    console.log('🧪 Probando API de Altior Traslados...\n');
    
    try {
        // 1. Probar endpoint raíz
        console.log('1. Probando endpoint raíz (/)');
        const rootResponse = await fetch(baseURL);
        console.log(`   Status: ${rootResponse.status}`);
        const rootData = await rootResponse.json();
        console.log(`   Mensaje: ${rootData.message}`);
        console.log(`   Versión: ${rootData.version}\n`);
        
        // 2. Probar endpoint de API
        console.log('2. Probando endpoint de información (/api)');
        const apiResponse = await fetch(`${baseURL}/api`);
        console.log(`   Status: ${apiResponse.status}`);
        const apiData = await apiResponse.json();
        console.log(`   Mensaje: ${apiData.message}`);
        console.log(`   Endpoints disponibles: ${Object.keys(apiData.endpoints).length}\n`);
        
        // 3. Probar listar reservas
        console.log('3. Probando listar reservas (/api/reservas)');
        const reservasResponse = await fetch(`${baseURL}/api/reservas`);
        console.log(`   Status: ${reservasResponse.status}`);
        const reservasData = await reservasResponse.json();
        console.log(`   Reservas encontradas: ${reservasData.length}\n`);
        
        // 4. Probar crear una reserva de prueba
        console.log('4. Probando crear reserva (/api/reservas)');
        const nuevaReserva = {
            codigo_reserva: `ALT-TEST-${Date.now()}`,
            email_cliente: 'test@altiortraslados.com',
            fecha: '2024-12-01',
            hora: '15:30',
            origen: 'Aeropuerto Ezeiza',
            destino: 'Palermo',
            pasajeros: 2,
            telefono: '+54 9 11 1234-5678'
        };
        
        const crearResponse = await fetch(`${baseURL}/api/reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaReserva)
        });
        
        console.log(`   Status: ${crearResponse.status}`);
        const crearData = await crearResponse.json();
        console.log(`   Resultado: ${crearData.success ? '✅ Reserva creada' : '❌ Error al crear reserva'}\n`);
        
        console.log('🎉 Pruebas completadas exitosamente!');
        
    } catch (error) {
        console.error('❌ Error en las pruebas:', error.message);
    }
}

// Ejecutar las pruebas
testAPI();