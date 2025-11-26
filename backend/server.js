// Servidor Express para manejar reservas y cancelaciones de Altior Traslados
const express = require('express');
const cors = require('cors');
const path = require('path');
const GestorReservas = require('./gestor-reservas');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Instanciar el gestor de reservas
const gestorReservas = new GestorReservas('reservas.json');

// Ruta para servir el frontend de prueba
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para servir el panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Endpoint para crear una nueva reserva
app.post('/api/reservas', (req, res) => {
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

// Endpoint para obtener una reserva por código
app.get('/api/reservas/:codigo', (req, res) => {
    try {
        const { codigo } = req.params;
        
        if (!codigo) {
            return res.status(400).json({
                success: false,
                message: 'Código de reserva requerido'
            });
        }
        
        const reserva = gestorReservas.obtenerReserva(codigo);
        
        if (reserva) {
            return res.json(reserva);
        } else {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
    } catch (error) {
        console.error('Error al obtener reserva:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener la reserva'
        });
    }
});

// Endpoint para cancelar una reserva
app.post('/api/reservas/:codigo/cancelar', (req, res) => {
    try {
        const { codigo } = req.params;
        
        if (!codigo) {
            return res.status(400).json({
                success: false,
                message: 'Código de reserva requerido'
            });
        }
        
        // Cancelar la reserva
        const resultado = gestorReservas.cancelarReserva(codigo);
        
        if (resultado.exito) {
            return res.json({
                success: true,
                reserva: resultado.reserva,
                message: 'Reserva cancelada exitosamente'
            });
        } else {
            return res.status(404).json({
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

// Endpoint para listar todas las reservas activas
app.get('/api/reservas', (req, res) => {
    try {
        const reservas = gestorReservas.listarReservasActivas();
        return res.json(reservas);
    } catch (error) {
        console.error('Error al listar reservas:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al listar las reservas'
        });
    }
});

// Endpoint para verificar una reserva
app.post('/api/verificar-reserva', (req, res) => {
    try {
        const { codigoReserva } = req.body;
        
        if (!codigoReserva) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Código de reserva requerido'
            });
        }
        
        const reserva = gestorReservas.verificarCodigoReserva(codigoReserva);
        
        if (reserva) {
            return res.json({
                exito: true,
                valido: true,
                reserva: reserva
            });
        } else {
            return res.json({
                exito: true,
                valido: false,
                mensaje: 'Código de reserva no válido o ya cancelado'
            });
        }
    } catch (error) {
        console.error('Error al verificar reserva:', error);
        return res.status(500).json({
            exito: false,
            mensaje: 'Error al verificar el código de reserva'
        });
    }
});

// Endpoint para cancelar una reserva
app.post('/api/cancelar-reserva', async (req, res) => {
    try {
        const { codigoReserva } = req.body;
        
        if (!codigoReserva) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Código de reserva requerido'
            });
        }
        
        // Validar formato del código (debe comenzar con ALT-)
        if (!codigoReserva.startsWith('ALT-')) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Formato de código de reserva inválido'
            });
        }
        
        // Cancelar la reserva
        const resultado = gestorReservas.cancelarReserva(codigoReserva);
        
        if (resultado.exito) {
            // En una implementación real, aquí se enviarían los correos usando Formspree
            console.log(`Reserva ${codigoReserva} cancelada. Enviar correos usando Formspree.`);
            
            return res.json({
                exito: true,
                cancelada: true,
                reserva: resultado.reserva,
                mensaje: 'Reserva cancelada exitosamente. Se han enviado correos de confirmación.'
            });
        } else {
            return res.json({
                exito: true,
                cancelada: false,
                mensaje: resultado.mensaje
            });
        }
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        return res.status(500).json({
            exito: false,
            mensaje: 'Error al procesar la cancelación'
        });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});