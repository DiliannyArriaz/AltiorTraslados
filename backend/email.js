const sgMail = require('@sendgrid/mail');

// Configuración de SendGrid
const SENDGRID_CONFIG = {
    apiKey: process.env.SENDGRID_API_KEY || 'TU_API_KEY_AQUI',
    fromEmail: 'altior.traslados@gmail.com',
    fromName: 'Altior Traslados'
};

sgMail.setApiKey(SENDGRID_CONFIG.apiKey);

/**
 * Enviar correo de confirmación de reserva
 */
async function sendReservationConfirmation(datosReserva) {
    try {
        const msg = {
            to: datosReserva.email_cliente,
            from: {
                email: SENDGRID_CONFIG.fromEmail,
                name: SENDGRID_CONFIG.fromName
            },
            subject: 'Confirmación de Reserva - Altior Traslados',
            text: `CONFIRMACIÓN DE RESERVA - ALTIOR TRASLADOS

DETALLES DE TU RESERVA:
• Código de reserva: ${datosReserva.codigo_reserva}
• Fecha: ${datosReserva.fecha} | Hora: ${datosReserva.hora}
• Ruta: ${datosReserva.origen} → ${datosReserva.destino}
• Vehículo: ${datosReserva.tipo_vehiculo}
• Maletas: ${datosReserva.cantidad_maletas}

Importante: Conserva este código para futuras consultas o modificaciones.

¡Gracias por elegir Altior Traslados!
Atentamente,
Equipo Altior Traslados`,
            html: `
                <h2>CONFIRMACIÓN DE RESERVA - ALTIOR TRASLADOS</h2>
                <p><strong>DETALLES DE TU RESERVA:</strong></p>
                <ul>
                    <li><strong>Código de reserva:</strong> ${datosReserva.codigo_reserva}</li>
                    <li><strong>Fecha:</strong> ${datosReserva.fecha} | <strong>Hora:</strong> ${datosReserva.hora}</li>
                    <li><strong>Ruta:</strong> ${datosReserva.origen} → ${datosReserva.destino}</li>
                    <li><strong>Vehículo:</strong> ${datosReserva.tipo_vehiculo}</li>
                    <li><strong>Maletas:</strong> ${datosReserva.cantidad_maletas}</li>
                </ul>
                <p><strong>Importante:</strong> Conserva este código para futuras consultas o modificaciones.</p>
                <p>¡Gracias por elegir Altior Traslados!</p>
                <p><em>Atentamente,<br>Equipo Altior Traslados</em></p>
            `,
        };

        await sgMail.send(msg);
        console.log('Correo de confirmación enviado exitosamente');
        return true;
    } catch (error) {
        console.error('Error enviando email de confirmación:', error);
        return false;
    }
}

/**
 * Enviar correo de cancelación de reserva
 */
async function sendCancellationConfirmation(datosReserva) {
    try {
        const msg = {
            to: datosReserva.email_cliente,
            from: {
                email: SENDGRID_CONFIG.fromEmail,
                name: SENDGRID_CONFIG.fromName
            },
            subject: 'Confirmación de Cancelación de Reserva - Altior Traslados',
            text: `CONFIRMACIÓN DE CANCELACIÓN - ALTIOR TRASLADOS

Tu reserva ${datosReserva.codigo_reserva} ha sido cancelada exitosamente.

DETALLES DE LA RESERVA CANCELADA:
• Fecha: ${datosReserva.fecha} | Hora: ${datosReserva.hora}
• Ruta: ${datosReserva.origen} → ${datosReserva.destino}

Si tienes alguna pregunta, no dudes en contactarnos.

Atentamente,
Equipo Altior Traslados`,
            html: `
                <h2>CONFIRMACIÓN DE CANCELACIÓN - ALTIOR TRASLADOS</h2>
                <p>Tu reserva <strong>${datosReserva.codigo_reserva}</strong> ha sido cancelada exitosamente.</p>
                <p><strong>DETALLES DE LA RESERVA CANCELADA:</strong></p>
                <ul>
                    <li><strong>Fecha:</strong> ${datosReserva.fecha} | <strong>Hora:</strong> ${datosReserva.hora}</li>
                    <li><strong>Ruta:</strong> ${datosReserva.origen} → ${datosReserva.destino}</li>
                </ul>
                <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                <p><em>Atentamente,<br>Equipo Altior Traslados</em></p>
            `,
        };

        await sgMail.send(msg);
        console.log('Correo de cancelación enviado exitosamente');
        return true;
    } catch (error) {
        console.error('Error enviando email de cancelación:', error);
        return false;
    }
}

module.exports = {
    sendReservationConfirmation,
    sendCancellationConfirmation
};