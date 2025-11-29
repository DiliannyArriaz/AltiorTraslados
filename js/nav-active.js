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
            // Página principal - activar "Reservar Ahora" si el href es #reservar
            if (href === '#reservar') {
                link.classList.add('active');
            }
        } else if (currentPage === 'precios.html') {
            // Página de precios - activar el enlace a precios.html
            if (href === 'precios.html') {
                link.classList.add('active');
            }
        } else if (currentPage === 'cancelar.html') {
            // Página de cancelación - activar el enlace a cancelar.html
            if (href === 'cancelar.html') {
                link.classList.add('active');
            }
        }
    });
});