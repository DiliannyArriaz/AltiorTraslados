# Altior Traslados

Sistema de reservas y gestión de traslados premium al aeropuerto.

## Estructura del Proyecto

```
altior-traslados/
├── index.html              # Página principal de reservas
├── cancelar.html           # Página de cancelación de reservas
├── precios.html            # Página de precios por zonas
├── css/                    # Archivos de estilo
│   ├── styles.css          # Estilos principales
│   └── precio-flotante.css # Estilos de la burbuja de precios
├── js/                     # Scripts JavaScript
│   ├── main.js             # Funcionalidad principal
│   ├── precios.js          # Sistema de autocompletado y precios
│   ├── precio-flotante.js  # Burbuja de precios flotante
│   └── hamburger-menu.js   # Menú hamburguesa para móviles
├── backend/                # Backend con Node.js + Express
│   ├── server.js           # Servidor Express
│   ├── gestor-reservas.js  # Clase para manejar reservas
│   ├── reservas.json       # Archivo de almacenamiento de reservas
│   ├── admin.html          # Panel de administración
│   ├── package.json        # Dependencias del backend
│   └── start.js            # Script de inicio
├── assets/                 # Recursos multimedia
└── README.md              # Este archivo
```

## Despliegue

### Frontend (Netlify)
1. Conectar repositorio a Netlify
2. Configurar sitio para servir desde raíz del proyecto
3. El sistema usará Formspree para envío de correos

### Backend (Render.com)
1. Conectar repositorio a Render.com
2. Configurar servicio web apuntando a `backend/server.js`
3. El servicio escuchará en el puerto definido por `process.env.PORT` o 3000

## Variables de Entorno

### Para Formspree (frontend)
- El sistema ya está configurado con el endpoint de Formspree

### Para el backend (opcional)
- `PORT`: Puerto donde escuchará el servidor (por defecto 3000)

## Desarrollo Local

### Frontend
Simplemente abrir `index.html` en un navegador, o usar un servidor local como:
```bash
npx serve
```

### Backend
```bash
cd backend
npm install
npm start
```

## API Endpoints

### Reservas
- `POST /api/reservas` - Crear nueva reserva
- `GET /api/reservas` - Listar reservas activas
- `GET /api/reservas/:codigo` - Obtener reserva por código
- `POST /api/reservas/:codigo/cancelar` - Cancelar reserva

### Panel de Administración
- `GET /admin` - Panel de administración de reservas

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Almacenamiento**: Archivo JSON
- **Envío de correos**: Formspree
- **Autocompletado**: OpenStreetMap API
- **Diseño**: Responsive design con media queries

## Características

- Sistema de autocompletado inteligente para direcciones
- Cálculo automático de precios por zona
- Burbuja de precios flotante
- Menú responsive para móviles
- Sistema de reservas con códigos únicos
- Panel de administración para gestión de reservas
- Cancelación de reservas con verificación
- Envío automático de correos de confirmación