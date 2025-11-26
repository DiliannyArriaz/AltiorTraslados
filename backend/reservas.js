// Backend para manejo de reservas
class ReservasBackend {
    constructor() {
        this.reservas = [];
        this.archivoReservas = 'reservas.json';
        this.cargarReservas();
    }

    // Cargar reservas desde el archivo JSON
    cargarReservas() {
        try {
            // En una implementación real, aquí se leería el archivo JSON
            // Por ahora simulamos con datos de ejemplo
            this.reservas = [
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
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            this.reservas = [];
        }
    }

    // Guardar reservas en el archivo JSON
    guardarReservas() {
        try {
            // En una implementación real, aquí se escribiría el archivo JSON
            console.log('Reservas guardadas:', this.reservas);
            return true;
        } catch (error) {
            console.error('Error al guardar reservas:', error);
            return false;
        }
    }

    // Verificar si un código de reserva es válido
    verificarCodigoReserva(codigo) {
        return this.reservas.find(reserva => 
            reserva.codigo === codigo && 
            reserva.estado === 'activa'
        );
    }

    // Cancelar una reserva
    cancelarReserva(codigo) {
        const reserva = this.verificarCodigoReserva(codigo);
        if (reserva) {
            reserva.estado = 'cancelada';
            reserva.fechaCancelacion = new Date().toISOString().split('T')[0];
            
            // Guardar cambios
            if (this.guardarReservas()) {
                return {
                    exito: true,
                    reserva: reserva,
                    mensaje: 'Reserva cancelada exitosamente'
                };
            } else {
                return {
                    exito: false,
                    mensaje: 'Error al guardar la cancelación'
                };
            }
        } else {
            return {
                exito: false,
                mensaje: 'Código de reserva no válido o ya cancelado'
            };
        }
    }

    // Obtener información de una reserva
    obtenerReserva(codigo) {
        return this.reservas.find(reserva => reserva.codigo === codigo);
    }

    // Listar reservas activas
    listarReservasActivas() {
        return this.reservas.filter(reserva => reserva.estado === 'activa');
    }

    // Agregar una nueva reserva (para pruebas)
    agregarReserva(reserva) {
        this.reservas.push(reserva);
        this.guardarReservas();
    }
}

// Exportar la clase (para uso en Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReservasBackend;
}