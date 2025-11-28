# Instrucciones para Configurar Google Sheets con Altior Traslados

## Paso 1: Crear una Hoja de Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Dale un nombre como "Reservas Altior Traslados"

## Paso 2: Configurar Google Apps Script

1. En la hoja de cálculo, ve a **Extensiones > Apps Script**
2. Borra el código predeterminado en el editor
3. Copia y pega el código del archivo `google-apps-script.js` de este proyecto
4. Guarda el proyecto (Ctrl+S o Cmd+S)
5. Dale un nombre al proyecto, por ejemplo "Altior Reservas"

## Paso 3: Configurar el Web App

1. En el editor de Apps Script, haz clic en **Deploy > New deployment**
2. Haz clic en el ícono de engranaje ⚙️
3. Selecciona tipo de despliegue: **Web app**
4. Configura los siguientes valores:
   - **Descripción:** Sistema de reservas Altior Traslados
   - **Execute as:** Me (tu correo de Google)
   - **Who has access:** Anyone (sin iniciar sesión)
5. Haz clic en **Deploy**
6. **Copia la URL de la Web app** que se muestra

## Paso 4: Actualizar la URL en el Código

1. Abre el archivo `js/main.js` de este proyecto
2. Busca la línea con `scriptUrl` y reemplaza la URL con la que copiaste en el paso anterior

## Paso 5: Probar el Sistema

1. Guarda todos los cambios en los archivos
2. Publica tu sitio web en Netlify
3. Realiza una reserva de prueba para verificar que los datos llegan a Google Sheets

## Beneficios de esta solución

- ✅ **Gratis**: Sin límites mensuales como Formspree
- ✅ **Persistente**: Los datos se guardan en Google Sheets
- ✅ **Accesible**: Puedes acceder a los datos desde cualquier dispositivo
- ✅ **Exportable**: Puedes exportar los datos a Excel, CSV, etc.
- ✅ **Notificaciones**: Envía correos automáticos al cliente y administrador

## Consideraciones

- Los datos se guardan en tu cuenta de Google
- Puedes compartir la hoja con otros colaboradores
- Google Sheets tiene límites de uso, pero son muy generosos para este caso
- La URL de la Web app no cambia una vez configurada

## Soporte

Si necesitas ayuda con la configuración, no dudes en contactarnos.