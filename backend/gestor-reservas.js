// Gestor de reservas para manejar operaciones con el archivo JSON
class GestorReservas {
    constructor(archivoReservas) {
        this.archivoReservas = archivoReservas || 'reservas.json';
        this.fs = require('fs');
        this.path = require('path');
    }

    // Leer reservas del archivo
    leerReservas() {
        try {
            const filePath = this.path.join(__dirname, this.archivoReservas);
            // Crear archivo si no existe
            if (!this.fs.existsSync(filePath)) {
                const data = { reservas: [] };
                this.fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                return data;
            }
            
            const data = this.fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer reservas:', error);
            return { reservas: [] };
        }
    }

    // Guardar reservas en el archivo
    guardarReservas(datos) {
        try {
            this.fs.writeFileSync(
                this.path.join(__dirname, this.archivoReservas), 
                JSON.stringify(datos, null, 2),
                'utf8'
            );
            return true;
        } catch (error) {
            console.error('Error al guardar reservas:', error);
            return false;
        }
    }

    // Verificar si un código de reserva es válido
    verificarCodigoReserva(codigo) {
        const datos = this.leerReservas();
        return datos.reservas.find(reserva => 
            reserva.codigo_reserva === codigo && 
            reserva.estado === 'activa'
        );
    }

    // Cancelar una reserva
    cancelarReserva(codigo) {
        const datos = this.leerReservas();
        const reserva = datos.reservas.find(r => 
            r.codigo_reserva === codigo && 
            r.estado === 'activa'
        );
        
        if (reserva) {
            reserva.estado = 'cancelada';
            reserva.fechaCancelacion = new Date().toISOString();
            
            if (this.guardarReservas(datos)) {
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

    // Agregar una nueva reserva
    agregarReserva(nuevaReserva) {
        const datos = this.leerReservas();
        datos.reservas.push(nuevaReserva);
        
        if (this.guardarReservas(datos)) {
            return {
                exito: true,
                reserva: nuevaReserva,
                mensaje: 'Reserva agregada exitosamente'
            };
        } else {
            return {
                exito: false,
                mensaje: 'Error al guardar la reserva'
            };
        }
    }

    // Listar reservas activas
    listarReservasActivas() {
        const datos = this.leerReservas();
        return datos.reservas.filter(reserva => reserva.estado === 'activa');
    }

    // Obtener información de una reserva específica
    obtenerReserva(codigo) {
        const datos = this.leerReservas();
        return datos.reservas.find(reserva => reserva.codigo_reserva === codigo);
    }
    
    // Listar todas las reservas (activas y canceladas)
    listarTodasReservas() {
        const datos = this.leerReservas();
        return datos.reservas;
    }
}

// Exportar la clase
module.exports = GestorReservas;