// Script para manejar la navegación activa
// Añade la clase 'active' al enlace correspondiente en función de la página actual

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el nombre del archivo actual
    const path = window.location.pathname;
    const currentPage = path.split('/').pop() || 'index.html';
    
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
    
    // Recorrer todos los enlaces y añadir la clase 'active' al correspondiente
    navLinks.forEach(link => {
        // Remover cualquier clase 'active' existente
        link.classList.remove('active');
        
        // Obtener el href del enlace
        const href = link.getAttribute('href');
        
        // Verificar si el enlace corresponde a la página actual
        if (currentPage === 'index.html' || currentPage === '') {
            // Página principal - activar "Reservar Ahora" si el href es #reservar o index.html#reservar
            if (href === '#reservar' || href === 'index.html#reservar') {
                link.classList.add('active');
            }
        } else if (currentPage === 'precios.html') {
            // Página de precios - no hay un enlace a "precios.html" en esta página
            // El enlace "Precios" no existe como enlace en la página de precios
        } else if (currentPage === 'cancelar.html') {
            // Página de cancelación - no hay un enlace a "cancelar.html" en esta página
            // El enlace "Cancelar Reserva" no existe como enlace en la página de cancelación
        }
    });
});