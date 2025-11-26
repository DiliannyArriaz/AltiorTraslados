// Servicio de envío de correos usando Formspree
class EmailService {
    constructor() {
        // Endpoint de Formspree para cancelaciones
        this.formspreeEndpoint = 'https://formspree.io/f/mgvrzkbd'; // Reemplazar con tu endpoint real
    }

    // Enviar correo de confirmación de cancelación al cliente
    async enviarConfirmacionCancelacionCliente(reserva) {
        try {
            const formData = new FormData();
            formData.append('_subject', 'Confirmación de Cancelación de Reserva - Altior Traslados');
            formData.append('email', reserva.email);
            formData.append('message', `
¡Reserva Cancelada!

Estimado/a ${reserva.nombre},

Le confirmamos que su reserva con código ${reserva.codigo} ha sido cancelada exitosamente.

Detalles de la reserva cancelada:
- Código de reserva: ${reserva.codigo}
- Fecha de reserva: ${reserva.fecha}
- Origen: ${reserva.origen}
- Destino: ${reserva.destino}
- Fecha de cancelación: ${reserva.fechaCancelacion}

Recibirá información sobre el reembolso correspondiente en las próximas 48 horas.

Gracias por confiar en Altior Traslados.
Atentamente,
Equipo de Altior Traslados
            `);

            const response = await fetch(this.formspreeEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                return { exito: true, mensaje: 'Correo de confirmación enviado al cliente' };
            } else {
                throw new Error('Error al enviar correo');
            }
        } catch (error) {
            console.error('Error al enviar correo al cliente:', error);
            return { exito: false, mensaje: 'Error al enviar correo de confirmación al cliente' };
        }
    }

    // Enviar notificación de cancelación a la empresa
    async enviarNotificacionCancelacionEmpresa(reserva) {
        try {
            const formData = new FormData();
            formData.append('_subject', 'NOTIFICACIÓN: Reserva Cancelada - ' + reserva.codigo);
            formData.append('email', 'info@altiortraslados.com'); // Tu email de empresa
            formData.append('message', `
RESERVA CANCELADA

Se ha cancelado la siguiente reserva:

Detalles de la reserva:
- Código de reserva: ${reserva.codigo}
- Nombre del cliente: ${reserva.nombre}
- Email del cliente: ${reserva.email}
- Fecha de reserva: ${reserva.fecha}
- Origen: ${reserva.origen}
- Destino: ${reserva.destino}
- Fecha de cancelación: ${reserva.fechaCancelacion}

Esta reserva ha sido marcada como cancelada en el sistema.
            `);

            const response = await fetch(this.formspreeEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                return { exito: true, mensaje: 'Notificación enviada a la empresa' };
            } else {
                throw new Error('Error al enviar notificación');
            }
        } catch (error) {
            console.error('Error al enviar notificación a la empresa:', error);
            return { exito: false, mensaje: 'Error al enviar notificación a la empresa' };
        }
    }

    // Enviar ambos correos
    async enviarCorreosCancelacion(reserva) {
        try {
            // Enviar correo al cliente
            const resultadoCliente = await this.enviarConfirmacionCancelacionCliente(reserva);
            
            // Enviar notificación a la empresa
            const resultadoEmpresa = await this.enviarNotificacionCancelacionEmpresa(reserva);
            
            if (resultadoCliente.exito && resultadoEmpresa.exito) {
                return {
                    exito: true,
                    mensajes: [resultadoCliente.mensaje, resultadoEmpresa.mensaje]
                };
            } else {
                return {
                    exito: false,
                    mensajes: [
                        resultadoCliente.mensaje || '',
                        resultadoEmpresa.mensaje || ''
                    ]
                };
            }
        } catch (error) {
            console.error('Error al enviar correos:', error);
            return {
                exito: false,
                mensaje: 'Error al enviar correos de cancelación'
            };
        }
    }
}

// Exportar la clase (para uso en Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}