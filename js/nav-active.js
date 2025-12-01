// Función para manejar la navegación activa
document.addEventListener('DOMContentLoaded', function() {
    // Obtener la ruta actual
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Recorrer los enlaces y agregar la clase 'active' al que corresponde
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Manejar las pestañas de precios si estamos en la página de precios
    if (currentPath === 'precios.html') {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        if (tabBtns.length > 0 && tabContents.length > 0) {
            // Función para cambiar de pestaña
            function changeTab(btn) {
                // Remover clase active de todos los botones y contenidos
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Agregar clase active al botón clickeado
                btn.classList.add('active');
                
                // Mostrar el contenido correspondiente
                const tabId = btn.getAttribute('data-tab');
                const content = document.getElementById(tabId + '-content');
                if (content) {
                    content.classList.add('active');
                }
            }
            
            tabBtns.forEach(btn => {
                // Evento click para escritorio
                btn.addEventListener('click', () => {
                    changeTab(btn);
                });
                
                // Evento touch para móviles
                btn.addEventListener('touchstart', () => {
                    changeTab(btn);
                });
            });
        }
    }
});

// Función para manejar el menú hamburguesa con mejor soporte táctil
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navRight = document.querySelector('.nav-right');
    
    if (hamburgerMenu && navRight) {
        // Función para toggle del menú
        function toggleMenu() {
            hamburgerMenu.classList.toggle('active');
            navRight.classList.toggle('active');
        }
        
        // Evento click para escritorio
        hamburgerMenu.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu();
        });
        
        // Evento touch para móviles
        hamburgerMenu.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleMenu();
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