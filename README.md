🚀 CompuTrabajo Clean Feed (Filtro de Empleadores)

📌 El Problema: El ruido en la búsqueda de empleo

Buscar trabajo debería ser un proceso enfocado y eficiente, pero los portales de empleo actuales suelen estar saturados de fricción. Como candidato, constantemente me enfrentaba a:



Spam de vacantes: Empresas publicando el mismo anuncio decenas de veces, sepultando las oportunidades reales.



Procesos fantasma: Consultoras o empleadores anónimos ("Importante empresa del sector") que no ofrecen transparencia y rara vez revisan los currículums, generando la sospecha de recolección de datos.



Falta de control: Imposibilidad de silenciar permanentemente a empresas con las que, por cultura o historial, no deseo postular.



💡 La Solución

Decidí dejar de frustrarme con la interfaz y tomar el control de mi propio feed de ofertas.



CompuTrabajo Clean Feed es una extensión para Google Chrome construida con JavaScript puro que empodera al candidato. Permite ocultar de manera instantánea y permanente todas las ofertas de empleadores específicos (incluyendo las molestas ofertas anónimas), limpiando la pantalla para enfocar la energía solo en vacantes de valor real.



✨ Características Principales

Bloqueo sin fricción (Zero-Click): Inyecta dinámicamente un botón de bloqueo (+) directamente en las tarjetas de las ofertas en CompuTrabajo. Un clic y la empresa desaparece para siempre.



Detección Inteligente de Anónimos: Capaz de identificar y bloquear ofertas sin enlace de empresa ("Importante empresa del sector") analizando la estructura del DOM.



Limpieza en Tiempo Real: Utiliza un MutationObserver para seguir ocultando ofertas automáticamente a medida que el usuario hace scroll y la página carga nuevos elementos.



Métricas de Impacto: Cuenta con un Badge en el ícono de la extensión que muestra cuántas ofertas de "basura" se han filtrado en la página actual, y un registro histórico de tiempo ahorrado en el panel de control.



Privacidad Total: Todo el procesamiento y almacenamiento de la "lista negra" se realiza de forma local usando chrome.storage.local. Ningún dato sale del navegador.



🛠️ Tecnologías Utilizadas

JavaScript (Vanilla): Lógica principal, manipulación del DOM y observadores de mutación.



Chrome Extensions API: Manejo de almacenamiento local (storage), paso de mensajes (runtime.sendMessage) y Service Workers (background.js).



HTML/CSS: Interfaz de usuario para el Popup y estilos inyectados directamente en la web de destino.



⚙️ Estructura del Proyecto

manifest.json: Configuración y permisos de la extensión (Manifest V3).



content.js: El motor principal. Lee el DOM, inyecta los botones y oculta los elementos indeseados.



background.js: Service Worker encargado de actualizar el contador de ofertas filtradas en el ícono del navegador.



popup.html / popup.js: Interfaz de administración para visualizar el histórico y gestionar manualmente la lista de empresas bloqueadas.

