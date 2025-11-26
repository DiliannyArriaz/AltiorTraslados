// API para manejo de cancelaciones de reservas
class CancelacionAPI {
    constructor() {
        // En una implementación real, aquí se importarían las clases
        // const ReservasBackend = require('./reservas.js');
        // const EmailService = require('./email.js');
        
        // this.reservasBackend = new ReservasBackend();
        // this.emailService = new EmailService();
    }

    // Verificar si un código de reserva es válido
    async verificarReserva(codigo) {
        try {
            // En una implementación real:
            // const reserva = this.reservasBackend.verificarCodigoReserva(codigo);
            
            // Simulación con datos de ejemplo
            const reservasEjemplo = [
                {
                    "codigo": "ALT-123456-78901",
                    "email": "cliente1@example.com",
                    "nombre": "Juan Pérez",
                    "fecha": "2024-02-15",
                    "origen": "Aeropuerto Ezeiza",
                    "destino": "Centro CABA",
                    "estado": "activa"
                },
                {
                    "codigo": "ALT-234567-89012",
                    "email": "cliente2@example.com",
                    "nombre": "María González",
                    "fecha": "2024-02-16",
                    "origen": "Centro CABA",
                    "destino": "Aeropuerto Ezeiza",
                    "estado": "activa"
                }
            ];
            
            const reserva = reservasEjemplo.find(r => 
                r.codigo === codigo && 
                r.estado === 'activa'
            );
            
            if (reserva) {
                return {
                    exito: true,
                    valido: true,
                    reserva: reserva
                };
            } else {
                return {
                    exito: true,
                    valido: false,
                    mensaje: 'Código de reserva no válido o ya cancelado'
                };
            }
        } catch (error) {
            console.error('Error al verificar reserva:', error);
            return {
                exito: false,
                mensaje: 'Error al verificar el código de reserva'
            };
        }
    }

    // Cancelar una reserva
    async cancelarReserva(codigo) {
        try {
            // 1. Verificar que el código sea válido
            const verificacion = await this.verificarReserva(codigo);
            
            if (!verificacion.exito) {
                return verificacion;
            }
            
            if (!verificacion.valido) {
                return {
                    exito: true,
                    cancelada: false,
                    mensaje: verificacion.mensaje
                };
            }
            
            // 2. En una implementación real, cancelar la reserva en el backend
            // const resultadoCancelacion = this.reservasBackend.cancelarReserva(codigo);
            
            // Simular cancelación
            const reserva = verificacion.reserva;
            reserva.estado = 'cancelada';
            reserva.fechaCancelacion = new Date().toISOString().split('T')[0];
            
            // 3. Enviar correos de confirmación usando Formspree
            // const resultadoCorreos = await this.emailService.enviarCorreosCancelacion(reserva);
            
            // Simular envío de correos con Formspree
            console.log(`Simulando envío de correo a ${reserva.email} usando Formspree`);
            console.log(`Simulando envío de notificación a la empresa usando Formspree`);
            
            // 4. Devolver resultado
            return {
                exito: true,
                cancelada: true,
                reserva: reserva,
                mensaje: 'Reserva cancelada exitosamente. Se han enviado correos de confirmación.'
            };
            
        } catch (error) {
            console.error('Error al cancelar reserva:', error);
            return {
                exito: false,
                mensaje: 'Error al procesar la cancelación'
            };
        }
    }
}

// Simulación de endpoint POST /api/cancelar-reserva
async function handleCancelacionRequest(requestData) {
    const api = new CancelacionAPI();
    
    if (!requestData.codigoReserva) {
        return {
            exito: false,
            mensaje: 'Código de reserva requerido'
        };
    }
    
    // Validar formato del código (debe comenzar con ALT-)
    if (!requestData.codigoReserva.startsWith('ALT-')) {
        return {
            exito: false,
            mensaje: 'Formato de código de reserva inválido'
        };
    }
    
    // Procesar cancelación
    const resultado = await api.cancelarReserva(requestData.codigoReserva);
    return resultado;
}

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CancelacionAPI,
        handleCancelacionRequest
    };
}