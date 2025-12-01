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
        // Función para inicializar las pestañas
        function initializeTabs() {
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');
            
            console.log('Inicializando pestañas - Pestañas encontradas:', tabBtns.length);
            console.log('Inicializando pestañas - Contenidos encontrados:', tabContents.length);
            
            if (tabBtns.length > 0 && tabContents.length > 0) {
                // Verificar que todos los contenidos necesarios existan
                let allContentsExist = true;
                tabBtns.forEach(btn => {
                    const tabId = btn.getAttribute('data-tab');
                    const contentId = tabId + '-content';
                    const content = document.getElementById(contentId);
                    if (!content) {
                        console.error('Falta el contenido para la pestaña:', tabId);
                        allContentsExist = false;
                    }
                });
                
                if (!allContentsExist) {
                    console.warn('Algunos contenidos de pestañas no se encontraron, reintentando en 200ms...');
                    setTimeout(initializeTabs, 200);
                    return;
                }
                
                // Función para cambiar de pestaña
                function changeTab(btn) {
                    console.log('Cambiando a pestaña:', btn.getAttribute('data-tab'));
                    
                    // Obtener los botones y contenidos actuales (después de cualquier clonado)
                    const currentTabBtns = document.querySelectorAll('.tab-btn');
                    const currentTabContents = document.querySelectorAll('.tab-content');
                    
                    // Remover clase active de todos los botones y contenidos
                    currentTabBtns.forEach(b => {
                        b.classList.remove('active');
                        console.log('Removiendo active de botón:', b.getAttribute('data-tab'));
                    });
                    
                    currentTabContents.forEach(c => {
                        c.classList.remove('active');
                        console.log('Removiendo active de contenido:', c.id);
                    });
                    
                    // Agregar clase active al botón clickeado
                    btn.classList.add('active');
                    console.log('Agregando active a botón:', btn.getAttribute('data-tab'));
                    
                    // Mostrar el contenido correspondiente
                    const tabId = btn.getAttribute('data-tab');
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
                
                // Limpiar eventos anteriores para evitar duplicados
                tabBtns.forEach(btn => {
                    // Remover eventos anteriores
                    const clone = btn.cloneNode(true);
                    btn.parentNode.replaceChild(clone, btn);
                });
                
                // Volver a obtener los botones después del clonado
                const newTabBtns = document.querySelectorAll('.tab-btn');
                
                newTabBtns.forEach(btn => {
                    // Evento click para escritorio
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        console.log('Click en botón:', btn.getAttribute('data-tab'));
                        changeTab(this);
                    });
                    
                    // Evento touch para móviles
                    btn.addEventListener('touchstart', function(e) {
                        e.preventDefault();
                        console.log('Touch en botón:', btn.getAttribute('data-tab'));
                        changeTab(this);
                    });
                });
                
                console.log('Pestañas inicializadas correctamente');
            } else {
                console.log('No se encontraron pestañas o contenidos, reintentando en 200ms...');
                setTimeout(initializeTabs, 200);
            }
        }
        
        // Inicializar las pestañas
        initializeTabs();
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