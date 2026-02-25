document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('empresaInput');
    const btnAgregar = document.getElementById('btnAgregar');
    const lista = document.getElementById('listaEmpresas');

    // Cargar empresas guardadas
    function cargarEmpresas() {
        chrome.storage.local.get({ empresas: [] }, (result) => {
            lista.innerHTML = '';
            result.empresas.forEach((empresa, index) => {
                const li = document.createElement('li');
                li.textContent = empresa;
                
                const btnBorrar = document.createElement('button');
                btnBorrar.textContent = 'X';
                btnBorrar.className = 'btn-delete';
                btnBorrar.onclick = () => borrarEmpresa(index);
                
                li.appendChild(btnBorrar);
                lista.appendChild(li);
            });
        });
    }

    // Agregar nueva empresa
    btnAgregar.onclick = () => {
        const nuevaEmpresa = input.value.trim();
        if (nuevaEmpresa) {
            chrome.storage.local.get({ empresas: [] }, (result) => {
                const empresasActualizadas = [...result.empresas, nuevaEmpresa];
                chrome.storage.local.set({ empresas: empresasActualizadas }, () => {
                    input.value = '';
                    cargarEmpresas();
                });
            });
        }
    };

    // Borrar empresa
    function borrarEmpresa(index) {
        chrome.storage.local.get({ empresas: [] }, (result) => {
            const empresasActualizadas = result.empresas.filter((_, i) => i !== index);
            chrome.storage.local.set({ empresas: empresasActualizadas }, () => {
                cargarEmpresas();
            });
        });
    }

    function cargarHistorico() {
        chrome.storage.local.get({ totalHistorico: 0 }, (result) => {
            document.getElementById('contadorHistorico').textContent = result.totalHistorico;
        });
    }

    // Llama a la función
    cargarHistorico();
    cargarEmpresas();

    // --- LÓGICA DE EXPORTAR ---
    const btnExportar = document.getElementById('btnExportar');
    btnExportar.onclick = () => {
        chrome.storage.local.get(['empresas', 'totalHistorico'], (result) => {
            // Convertimos los datos a formato JSON
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
            
            // Creamos un enlace temporal para forzar la descarga
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "filtro_computrabajo_backup.json");
            document.body.appendChild(downloadAnchorNode); // Requerido para Firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });
    };

    // --- LÓGICA DE IMPORTAR ---
    const btnImportar = document.getElementById('btnImportar');
    const fileImportar = document.getElementById('fileImportar');

    // Al hacer clic en el botón, abrimos la ventana de archivos oculta
    btnImportar.onclick = () => fileImportar.click();

    // Cuando el usuario selecciona un archivo
    fileImportar.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonData = JSON.parse(event.target.result);
                
                // Validamos que el archivo tenga la estructura correcta
                if (jsonData.empresas && Array.isArray(jsonData.empresas)) {
                    if (confirm(`¿Estás seguro? Esto reemplazará tu lista actual por las ${jsonData.empresas.length} empresas del archivo.`)) {
                        chrome.storage.local.set({
                            empresas: jsonData.empresas,
                            totalHistorico: jsonData.totalHistorico || 0
                        }, () => {
                            cargarEmpresas();
                            cargarHistorico();
                            // Limpiamos el input para que permita volver a subir el mismo archivo si se necesita
                            fileImportar.value = ''; 
                        });
                    }
                } else {
                    alert("El archivo no tiene el formato correcto.");
                }
            } catch (err) {
                alert("Error al leer el archivo JSON.");
            }
        };
        reader.readAsText(file);
    };
});