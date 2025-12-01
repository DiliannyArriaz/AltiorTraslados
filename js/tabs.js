document.addEventListener('DOMContentLoaded', function() {
    // Obtener los botones de las pestañas
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Función para cambiar de pestaña
    function changeTab(event) {
        // Prevenir el comportamiento por defecto si es necesario
        event.preventDefault();
        
        // Obtener el tab que se quiere mostrar
        const targetTab = this.getAttribute('data-tab');
        
        // Ocultar todos los contenidos
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Remover clase active de todas las pestañas
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Mostrar el contenido correspondiente
        const targetContent = document.getElementById(targetTab + '-content');
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        // Agregar clase active a la pestaña clickeada
        this.classList.add('active');
    }
    
    // Asignar eventos a las pestañas
    tabButtons.forEach(button => {
        button.addEventListener('click', changeTab);
    });
});