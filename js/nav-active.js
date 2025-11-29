// Funcionalidad para manejar las pestañas de precios
document.addEventListener('DOMContentLoaded', function() {
    // Manejar las pestañas de precios
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remover clase active de todos los botones y contenidos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Agregar clase active al botón clickeado y su contenido correspondiente
                this.classList.add('active');
                document.getElementById(`${tabId}-content`).classList.add('active');
            });
        });
    }
    
    // Manejar navegación activa en el navbar
    const currentLocation = location.href;
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
    
    navLinks.forEach(link => {
        // Comparar solo el pathname para evitar problemas con el hash
        if (link.href === currentLocation || 
            (link.href.replace(location.origin, '') === location.pathname)) {
            link.classList.add('active');
        }
    });
});