let empresasBloqueadas = [];

// --- 1. Inyección de Estilos CSS para el nuevo botón ---
const style = document.createElement('style');
style.textContent = `
    .ct-bloquear-wrapper {
        display: inline-flex;
        align-items: center;
        margin-left: 10px;
    }
    .ct-bloquear-btn {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        border: none;
        background: none;
        padding: 0;
        font-family: inherit;
        transition: all 0.2s ease;
        text-decoration: none !important; /* Evita subrayados del tema de CT */
    }
    .ct-bloquear-btn:hover { opacity: 0.8; }
    .ct-bloquear-icon {
        width: 22px;
        height: 22px;
        background-color: #d1e7dd; /* Verde muy claro relleno */
        color: #146c43; /* Verde oscuro texto */
        border: 1px solid #a3cfbb;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 16px;
        margin-right: 5px;
        padding-bottom: 2px; /* Ajuste visual fino para el + */
    }
    .ct-bloquear-label {
        font-size: 12px;
        color: #146c43;
        display: none; /* Oculto por defecto para no ensuciar */
        white-space: nowrap;
    }
    /* Mostrar texto solo al pasar el mouse */
    .ct-bloquear-btn:hover .ct-bloquear-label { display: inline-block; }
`;
document.head.appendChild(style);


// --- 2. Lógica Principal ---

function actualizarListaYLimpiar() {
    chrome.storage.local.get({ empresas: [] }, (result) => {
        empresasBloqueadas = result.empresas;
        // Reseteamos marcas de conteo al actualizar la lista
        document.querySelectorAll('article.box_offer').forEach(o => delete o.dataset.yaContada);
        limpiarOfertas();
    });
}

function bloquearEmpresaDirectamente(nombreEmpresa) {
    // Usamos un Set para evitar duplicados automáticamente
    const nuevaLista = [...new Set([...empresasBloqueadas, nombreEmpresa])];
    chrome.storage.local.set({ empresas: nuevaLista });
    // El listener de storage.onChanged se encargará de refrescar la pantalla
}

function crearBotonBloqueo(nombreEmpresa) {
    // Contenedor para aislar nuestros estilos
    const wrapper = document.createElement('span');
    wrapper.className = 'ct-bloquear-wrapper ct-inyectado'; // Clase 'inyectado' para identificarlo

    const btn = document.createElement('button');
    btn.className = 'ct-bloquear-btn';
    btn.title = `Ocultar todas las ofertas de ${nombreEmpresa}`;
    
    // El icono circular con el +
    const icon = document.createElement('span');
    icon.className = 'ct-bloquear-icon';
    icon.textContent = '+'; // Podríamos usar un ícono de "prohibido" también

    // El texto que aparece al pasar el mouse
    const label = document.createElement('span');
    label.className = 'ct-bloquear-label';
    label.textContent = 'Ocultar empleador';

    btn.appendChild(icon);
    btn.appendChild(label);

    // La acción al hacer clic
    btn.onclick = (e) => {
        e.preventDefault(); // Evita que el clic te lleve al detalle de la oferta
        e.stopPropagation(); // Evita que otros eventos de la tarjeta se disparen
        if (confirm(`¿Seguro que quieres ocultar todas las ofertas de "${nombreEmpresa}"?`)) {
            bloquearEmpresaDirectamente(nombreEmpresa);
        }
    };

    wrapper.appendChild(btn);
    return wrapper;
}

function limpiarOfertas() {
    const ofertas = document.querySelectorAll('article.box_offer');
    let ocultasEnEstaPagina = 0;
    let nuevasParaElHistorico = 0;

    ofertas.forEach(oferta => {
        // En lugar de buscar el enlace directo, buscamos el párrafo que contiene a la empresa
        const contenedorEmpresa = oferta.querySelector('p.dFlex.vm_fx');

        if (contenedorEmpresa) {
            let nombreEmpresa = "";
            let empresaLink = null;

            // PLAN A: Buscamos si tiene el enlace normal de la empresa
            empresaLink = contenedorEmpresa.querySelector('a[offer-grid-article-company-url]');

            if (empresaLink) {
                nombreEmpresa = empresaLink.innerText.trim();
            } else {
                // PLAN B: Es confidencial ("Importante empresa..."). Leemos el texto del párrafo.
                // Usamos replace para limpiar los saltos de línea que deja CompuTrabajo en el HTML
                nombreEmpresa = contenedorEmpresa.innerText.replace(/\n/g, '').trim();
            }

            // Si por algún motivo está vacío, saltamos a la siguiente oferta
            if (!nombreEmpresa) return;

            const debeOcultarse = empresasBloqueadas.some(empresa => 
                nombreEmpresa.toLowerCase() === empresa.toLowerCase()
            );

            if (debeOcultarse) {
                oferta.style.display = 'none';
                ocultasEnEstaPagina++;
                if (!oferta.dataset.yaContada) {
                    oferta.dataset.yaContada = 'true';
                    nuevasParaElHistorico++;
                }
            } else {
                oferta.style.display = ''; 
                delete oferta.dataset.yaContada; 

                // Inyección del botón si es que aún no existe
                if (!contenedorEmpresa.querySelector('.ct-inyectado')) {
                    const boton = crearBotonBloqueo(nombreEmpresa);
                    
                    // Si hay enlace, lo ponemos justito al lado. Si no, al final del párrafo.
                    if (empresaLink && empresaLink.nextSibling) {
                        contenedorEmpresa.insertBefore(boton, empresaLink.nextSibling);
                    } else {
                        contenedorEmpresa.appendChild(boton);
                    }
                }
            }
        }
    });

    // Actualizar Badges e Históricos
    chrome.runtime.sendMessage({ action: 'actualizarBadge', cantidad: ocultasEnEstaPagina });

    if (nuevasParaElHistorico > 0) {
        chrome.storage.local.get({ totalHistorico: 0 }, (result) => {
            chrome.storage.local.set({ totalHistorico: result.totalHistorico + nuevasParaElHistorico });
        });
    }
}

// Inicialización
actualizarListaYLimpiar();

// Observadores
const observador = new MutationObserver(() => {
    limpiarOfertas();
});
observador.observe(document.body, { childList: true, subtree: true });

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.empresas) {
        empresasBloqueadas = changes.empresas.newValue;
        // Al cambiar la lista, limpiamos botones inyectados previos para evitar conflictos
        document.querySelectorAll('.ct-inyectado').forEach(el => el.remove());
        limpiarOfertas();
    }
});