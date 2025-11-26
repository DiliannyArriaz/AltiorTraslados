// Servidor Express para manejar reservas y cancelaciones de Altior Traslados
const express = require('express');
const cors = require('cors');
const path = require('path');
const GestorReservas = require('./gestor-reservas');
const { sendReservationConfirmation, sendCancellationConfirmation } = require('./email');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Instanciar el gestor de reservas
const gestorReservas = new GestorReservas('reservas.json');

// Ruta principal - información de la API
app.get('/', (req, res) => {
    res.json({
        message: 'API de Altior Traslados',
        version: '1.0.0',
        endpoints: {
            'GET /api/reservas': 'Listar reservas activas',
            'POST /api/reservas': 'Crear nueva reserva',
            'GET /api/reservas/:codigo': 'Obtener reserva por código',
            'POST /api/reservas/:codigo/cancelar': 'Cancelar reserva',
            'POST /api/verificar-reserva': 'Verificar código de reserva',
            'POST /api/cancelar-reserva': 'Cancelar reserva con verificación'
        }
    });
});

// Ruta para información de la API
app.get('/api', (req, res) => {
    res.json({
        message: 'API de Altior Traslados',
        endpoints: {
            'GET /api/reservas': 'Listar reservas activas',
            'POST /api/reservas': 'Crear nueva reserva',
            'GET /api/reservas/:codigo': 'Obtener reserva por código',
            'POST /api/reservas/:codigo/cancelar': 'Cancelar reserva',
            'POST /api/verificar-reserva': 'Verificar código de reserva',
            'POST /api/cancelar-reserva': 'Cancelar reserva con verificación'
        }
    });
});

// Endpoint para crear una nueva reserva
app.post('/api/reservas', async (req, res) => {
    try {
        const datosReserva = req.body;
        
        // Validar datos requeridos
        if (!datosReserva.codigo_reserva) {
            return res.status(400).json({
                success: false,
                message: 'Código de reserva requerido'
            });
        }
        
        // Agregar reserva
        const resultado = gestorReservas.agregarReserva({
            ...datosReserva,
            estado: 'activa',
            fechaCreacion: new Date().toISOString()
        });
        
        if (resultado.exito) {
            // Enviar correo de confirmación
            await sendReservationConfirmation(datosReserva);
            
            return res.json({
                success: true,
                reserva: resultado.reserva,
                message: 'Reserva guardada exitosamente'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: resultado.mensaje
            });
        }
    } catch (error) {
        console.error('Error al crear reserva:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al procesar la reserva'
        });
    }
});

// Endpoint para obtener todas las reservas activas
app.get('/api/reservas', (req, res) => {
    try {
        const reservas = gestorReservas.listarReservasActivas();
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
});

// Endpoint para obtener una reserva específica por código
app.get('/api/reservas/:codigo', (req, res) => {
    try {
        const { codigo } = req.params;
        const reserva = gestorReservas.obtenerReserva(codigo);
        
        if (reserva) {
            res.json(reserva);
        } else {
            res.status(404).json({ error: 'Reserva no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener reserva:', error);
        res.status(500).json({ error: 'Error al obtener reserva' });
    }
});

// Endpoint para cancelar una reserva
app.post('/api/reservas/:codigo/cancelar', async (req, res) => {
    try {
        const { codigo } = req.params;
        const reserva = gestorReservas.obtenerReserva(codigo);
        
        if (!reserva) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        
        if (reserva.estado === 'cancelada') {
            return res.status(400).json({
                success: false,
                message: 'La reserva ya está cancelada'
            });
        }
        
        // Cancelar la reserva
        const resultado = gestorReservas.cancelarReserva(codigo);
        
        if (resultado.exito) {
            // Enviar correo de confirmación de cancelación
            await sendCancellationConfirmation(reserva.datos || reserva);
            
            return res.json({
                success: true,
                message: 'Reserva cancelada exitosamente'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: resultado.mensaje
            });
        }
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al cancelar la reserva'
        });
    }
});

// Endpoint para verificar una reserva (para el formulario de cancelación)
app.post('/api/verificar-reserva', (req, res) => {
    try {
        const { codigo_reserva } = req.body;
        
        if (!codigo_reserva) {
            return res.status(400).json({
                success: false,
                message: 'Código de reserva requerido'
            });
        }
        
        const reserva = gestorReservas.obtenerReserva(codigo_reserva);
        
        if (reserva && reserva.estado === 'activa') {
            return res.json({
                success: true,
                message: 'Reserva válida',
                reserva: {
                    codigo: reserva.codigo,
                    fecha: reserva.datos.fecha,
                    hora: reserva.datos.hora,
                    origen: reserva.datos.origen,
                    destino: reserva.datos.destino
                }
            });
        } else if (reserva && reserva.estado === 'cancelada') {
            return res.status(400).json({
                success: false,
                message: 'La reserva ya ha sido cancelada'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Código de reserva no válido'
            });
        }
    } catch (error) {
        console.error('Error al verificar reserva:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al verificar la reserva'
        });
    }
});

// Endpoint para cancelar una reserva desde el formulario de cancelación
app.post('/api/cancelar-reserva', async (req, res) => {
    try {
        const { codigo_reserva } = req.body;
        
        if (!codigo_reserva) {
            return res.status(400).json({
                success: false,
                message: 'Código de reserva requerido'
            });
        }
        
        const reserva = gestorReservas.obtenerReserva(codigo_reserva);
        
        if (!reserva) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        
        if (reserva.estado === 'cancelada') {
            return res.status(400).json({
                success: false,
                message: 'La reserva ya está cancelada'
            });
        }
        
        // Cancelar la reserva
        const resultado = gestorReservas.cancelarReserva(codigo_reserva);
        
        if (resultado.exito) {
            // Enviar correo de confirmación de cancelación
            await sendCancellationConfirmation(reserva.datos || reserva);
            
            return res.json({
                success: true,
                message: 'Reserva cancelada exitosamente'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: resultado.mensaje
            });
        }
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al cancelar la reserva'
        });
    }
});

// Servir el panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en puerto ${PORT}`);
});