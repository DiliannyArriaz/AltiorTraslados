document.addEventListener('DOMContentLoaded', function() {
    // Obtener los enlaces de las pestañas
    const tabLinks = document.querySelectorAll('.tab-btn');
    
    // Función para cambiar de pestaña
    function changeTab(event) {
        event.preventDefault();
        
        // Obtener el ID del contenido a mostrar
        const targetId = this.getAttribute('href').substring(1);
        
        // Ocultar todos los contenidos
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
        
        // Remover clase active de todas las pestañas
        tabLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Mostrar el contenido correspondiente
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.style.display = 'block';
        }
        
        // Agregar clase active a la pestaña clickeada
        this.classList.add('active');
    }
    
    // Asignar eventos a las pestañas
    tabLinks.forEach(link => {
        link.addEventListener('click', changeTab);
    });
    
    // Mostrar la primera pestaña por defecto
    const firstTabContent = document.getElementById('ezeiza-content');
    if (firstTabContent) {
        firstTabContent.style.display = 'block';
    }
});