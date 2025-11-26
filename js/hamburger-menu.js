// Script para el menú hamburguesa
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navRight = document.querySelector('.nav-right');
    
    if (hamburgerMenu && navRight) {
        hamburgerMenu.addEventListener('click', function() {
            // Toggle la clase active en ambos elementos
            hamburgerMenu.classList.toggle('active');
            navRight.classList.toggle('active');
        });
        
        // Cerrar el menú si se hace clic fuera de él
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navRight.contains(event.target) || hamburgerMenu.contains(event.target);
            
            if (!isClickInsideNav && navRight.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                navRight.classList.remove('active');
            }
        });
        
        // Cerrar el menú si la ventana se redimensiona a más de 768px
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburgerMenu.classList.remove('active');
                navRight.classList.remove('active');
            }
        });
    }
});