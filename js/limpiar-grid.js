// Script para eliminar los estilos que modifican el grid
// Se ejecuta DESPUÉS de precios.js para limpiar los estilos problemáticos

(function () {
    'use strict';

    // Función para eliminar estilos problemáticos del DOM
    function eliminarEstilosGrid() {
        // Buscar todos los tags <style> en el head
        const styles = document.querySelectorAll('head style');

        styles.forEach(style => {
            const content = style.textContent || style.innerHTML;

            // Si contiene la regla problemática del grid
            if (content.includes('grid-template-columns: 1fr 1fr 400px')) {
                console.log('Eliminando estilos de grid problemáticos...');

                // Reemplazar el contenido eliminando las reglas del grid
                let newContent = content;

                // Eliminar la regla del hero-content
                newContent = newContent.replace(/\.hero-content\s*\{[^}]*grid-template-columns:[^}]*\}/g, '');

                // Actualizar el contenido del style tag
                style.textContent = newContent;
            }
        });
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            // Esperar un poco para que precios.js agregue sus estilos
            setTimeout(eliminarEstilosGrid, 200);
        });
    } else {
        setTimeout(eliminarEstilosGrid, 200);
    }

    // También observar cuando se agreguen nuevos <style> tags
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.tagName === 'STYLE') {
                    setTimeout(eliminarEstilosGrid, 50);
                }
            });
        });
    });

    if (document.head) {
        observer.observe(document.head, {
            childList: true
        });
    }
})();
