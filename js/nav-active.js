// Función para manejar la navegación activa
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando nav-active.js');
    
    // Obtener la ruta actual
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Página actual:', currentPath);
    
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
        console.log('Iniciando manejo de pestañas de precios');
        
        // Función para inicializar las pestañas
        function initializeTabs() {
            console.log('Intentando inicializar pestañas...');
            
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');
            
            console.log('Pestañas encontradas:', tabBtns.length);
            console.log('Contenidos encontrados:', tabContents.length);
            
            // Verificar que tengamos ambos elementos
            if (tabBtns.length === 0) {
                console.warn('No se encontraron botones de pestañas');
                return;
            }
            
            if (tabContents.length === 0) {
                console.warn('No se encontraron contenidos de pestañas');
                return;
            }
            
            // Verificar que todos los contenidos necesarios existan
            let allContentsExist = true;
            tabBtns.forEach(btn => {
                const tabId = btn.getAttribute('data-tab');
                const contentId = tabId + '-content';
                const content = document.getElementById(contentId);
                if (!content) {
                    console.error('Falta el contenido para la pestaña:', tabId);
                    allContentsExist = false;
                } else {
                    console.log('Encontrado contenido para pestaña:', tabId);
                }
            });
            
            if (!allContentsExist) {
                console.warn('Algunos contenidos de pestañas no se encontraron');
                return;
            }
            
            // Función para cambiar de pestaña
            function changeTab(clickedBtn) {
                console.log('Cambiando a pestaña:', clickedBtn.getAttribute('data-tab'));
                
                // Remover clase active de todos los botones y contenidos
                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    console.log('Removiendo active de botón:', b.getAttribute('data-tab'));
                });
                
                tabContents.forEach(c => {
                    c.classList.remove('active');
                    console.log('Removiendo active de contenido:', c.id);
                });
                
                // Agregar clase active al botón clickeado
                clickedBtn.classList.add('active');
                console.log('Agregando active a botón:', clickedBtn.getAttribute('data-tab'));
                
                // Mostrar el contenido correspondiente
                const tabId = clickedBtn.getAttribute('data-tab');
                const contentId = tabId + '-content';
                console.log('Buscando contenido con ID:', contentId);
                
                const content = document.getElementById(contentId);
                if (content) {
                    content.classList.add('active');
                    console.log('Agregando active a contenido:', contentId);
                } else {
                    console.error('No se encontró el contenido con ID:', contentId);
                }
            }
            
            // Asignar eventos a los botones
            tabBtns.forEach(btn => {
                // Remover eventos anteriores si existen
                const clone = btn.cloneNode(true);
                btn.parentNode.replaceChild(clone, btn);
            });
            
            // Volver a obtener los botones después del clonado
            const newTabBtns = document.querySelectorAll('.tab-btn');
            
            newTabBtns.forEach(btn => {
                console.log('Asignando evento a botón:', btn.getAttribute('data-tab'));
                
                // Evento click para escritorio
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Click detectado en botón:', btn.getAttribute('data-tab'));
                    changeTab(btn);
                });
                
                // Evento touch para móviles
                btn.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    console.log('Touch detectado en botón:', btn.getAttribute('data-tab'));
                    changeTab(btn);
                });
            });
            
            console.log('Pestañas inicializadas correctamente');
        }
        
        // Inicializar las pestañas después de un pequeño retraso para asegurar que el DOM esté listo
        setTimeout(initializeTabs, 100);
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