#!/usr/bin/env node

// Script para iniciar el servidor backend de Altior Traslados

const { spawn } = require('child_process');
const path = require('path');

// Verificar si estamos en el directorio correcto
const backendDir = __dirname;
const serverFile = path.join(backendDir, 'server.js');

console.log('🚀 Iniciando servidor backend de Altior Traslados...');
console.log('📁 Directorio backend:', backendDir);

// Verificar si server.js existe
const fs = require('fs');
if (!fs.existsSync(serverFile)) {
    console.error('❌ Error: No se encuentra el archivo server.js');
    console.error('   Ruta esperada:', serverFile);
    process.exit(1);
}

// Iniciar el servidor usando node
const server = spawn('node', [serverFile], {
    cwd: backendDir,
    stdio: 'inherit'
});

server.on('close', (code) => {
    console.log(`🚪 Servidor cerrado con código ${code}`);
});

server.on('error', (error) => {
    console.error('❌ Error al iniciar el servidor:', error.message);
    if (error.code === 'ENOENT') {
        console.error('   Asegúrate de tener Node.js instalado en tu sistema');
    }
});

console.log('✅ Servidor iniciado. Accede a:');
console.log('   Panel de administración: http://localhost:3000/admin');
console.log('   API de reservas: http://localhost:3000/api/reservas');
console.log('   Presiona Ctrl+C para detener el servidor');