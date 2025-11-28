// Script para manejar la navegación activa
// Añade la clase 'active' al enlace correspondiente en función de la página actual

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el nombre del archivo actual
    const currentPage = window.location.pathname.split('/').pop();
    
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
    
    // Recorrer todos los enlaces y añadir la clase 'active' al correspondiente
    navLinks.forEach(link => {
        // Remover cualquier clase 'active' existente
        link.classList.remove('active');
        
        // Verificar si el enlace corresponde a la página actual
        if (currentPage === '' || currentPage === 'index.html') {
            // Página principal - activar "Reservar Ahora"
            if (link.getAttribute('href') === '#reservar' || 
                link.getAttribute('href') === 'index.html#reservar') {
                link.classList.add('active');
            }
        } else if (currentPage === 'precios.html') {
            // Página de precios
            if (link.textContent.trim() === 'Precios') {
                link.classList.add('active');
            }
        } else if (currentPage === 'cancelar.html') {
            // Página de cancelación
            if (link.textContent.trim() === 'Cancelar Reserva') {
                link.classList.add('active');
            }
        }
    });
});