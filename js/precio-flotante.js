// Script para mover la burbuja al body y hacerla completamente flotante
// Este script se ejecuta DESPUÉS de precios.js y corrige el posicionamiento

(function () {
    'use strict';

    // Función para mover la burbuja al body
    function moverBurbujaAlBody() {
        const precioContainer = document.getElementById('precioContainer');

        if (precioContainer) {
            // Mover al body si no está ya ahí
            if (precioContainer.parentElement && precioContainer.parentElement !== document.body) {
                document.body.appendChild(precioContainer);
            }

            // Forzar que tenga la clase visible si tiene precio
            const precioValor = document.getElementById('precioValor');
            if (precioValor) {
                const texto = precioValor.textContent.trim();
                if (texto && texto !== '-' && texto !== 'Calculando...') {
                    precioContainer.classList.add('visible');
                    // Marcar que la burbuja ya ha sido mostrada
                    precioContainer.setAttribute('data-mostrada', 'true');
                } else if (precioContainer.getAttribute('data-mostrada') === 'true') {
                    // Mantener visible si ya se mostró al menos una vez
                    precioContainer.classList.add('visible');
                } else {
                    // En móviles, mostrar la burbuja incluso si no hay precio aún
                    if (window.innerWidth <= 768) {
                        precioContainer.classList.add('visible');
                    }
                }
            }

            // Observar cambios en el contenido para mostrar/ocultar
            const observer = new MutationObserver(() => {
                const precioValor = document.getElementById('precioValor');
                if (precioValor) {
                    const texto = precioValor.textContent.trim();
                    if (texto && texto !== '-' && texto !== 'Calculando...') {
                        precioContainer.classList.add('visible');
                        // Marcar que la burbuja ya ha sido mostrada
                        precioContainer.setAttribute('data-mostrada', 'true');
                    } else if (precioContainer.getAttribute('data-mostrada') === 'true') {
                        // Mantener visible si ya se mostró al menos una vez
                        precioContainer.classList.add('visible');
                    } else {
                        // En móviles, mantener la burbuja visible
                        if (window.innerWidth <= 768) {
                            precioContainer.classList.add('visible');
                        }
                    }
                }
            });

            observer.observe(precioContainer, {
                childList: true,
                subtree: true,
                characterData: true
            });

            return true;
        }
        return false;
    }

    // Intentar mover la burbuja cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            // Esperar un poco para que precios.js cree la burbuja
            setTimeout(function () {
                if (!moverBurbujaAlBody()) {
                    // Si no existe, seguir intentando
                    const interval = setInterval(function () {
                        if (moverBurbujaAlBody()) {
                            clearInterval(interval);
                        }
                    }, 100);

                    // Dejar de intentar después de 10 segundos
                    setTimeout(function () {
                        clearInterval(interval);
                    }, 10000);
                }
            }, 100);
        });
    } else {
        // El DOM ya está listo
        setTimeout(function () {
            if (!moverBurbujaAlBody()) {
                // Si no existe, seguir intentando
                const interval = setInterval(function () {
                    if (moverBurbujaAlBody()) {
                        clearInterval(interval);
                    }
                }, 100);

                // Dejar de intentar después de 10 segundos
                setTimeout(function () {
                    clearInterval(interval);
                }, 10000);
            }
        }, 100);
    }

    // También observar cuando se agreguen nuevos elementos al DOM
    const bodyObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.id === 'precioContainer') {
                    moverBurbujaAlBody();
                }
            });
        });
    });

    // Observar el body para detectar cuando se agregue la burbuja
    if (document.body) {
        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
