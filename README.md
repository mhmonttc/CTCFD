# 🚀 CompuTrabajo Clean Feed (Filtro de Empleadores)

## 📌 El Problema: El ruido en la búsqueda de empleo
Buscar trabajo debería ser un proceso enfocado y eficiente, pero los portales de empleo actuales suelen estar saturados de fricción. Como candidato, me enfrentaba constantemente a:
* **Spam de vacantes:** Empresas publicando el mismo anuncio decenas de veces, sepultando las oportunidades reales.
* **Procesos fantasma:** Consultoras o empleadores anónimos ("Importante empresa del sector") que no ofrecen transparencia.
* **Falta de control:** Imposibilidad de silenciar permanentemente a empresas con las que no deseo postular.

## 💡 La Solución
**CompuTrabajo Clean Feed** es una extensión para Google Chrome construida con JavaScript puro que empodera al candidato. Permite ocultar de manera instantánea y permanente todas las ofertas de empleadores específicos (incluyendo ofertas anónimas), limpiando la pantalla para enfocar la energía solo en vacantes de valor real.

## ✨ Características Principales
* **Bloqueo sin fricción (Zero-Click):** Inyecta dinámicamente un botón de bloqueo (`+`) directamente en las tarjetas de las ofertas.
* **Detección Inteligente de Anónimos:** Capaz de identificar y bloquear ofertas sin enlace de empresa analizando la estructura del DOM.
* **Limpieza en Tiempo Real:** Utiliza un `MutationObserver` para seguir ocultando ofertas automáticamente al hacer *scroll*.
* **Métricas de Impacto:** Un contador en el ícono de la extensión muestra cuántas ofertas de "basura" se han filtrado en tiempo real, con un registro histórico en el panel de control.
* **Portabilidad:** Permite exportar e importar tu "lista negra" de empresas en formato `.json`.
* **Privacidad Total:** Todo el procesamiento y almacenamiento se realiza de forma local usando la API de Chrome. Ningún dato sale de tu navegador.

## 🛠️ Tecnologías Utilizadas
* **JavaScript (Vanilla):** Lógica principal y manipulación del DOM.
* **Chrome Extensions API (Manifest V3):** Manejo de almacenamiento local, paso de mensajes y Service Workers.
* **HTML/CSS:** Interfaz de usuario para el panel de control.

## ⚙️ Estructura del Proyecto
Haz clic en los archivos para ver el código fuente:
* [`manifest.json`](./manifest.json): Configuración y permisos de la extensión.
* [`content.js`](./content.js): El motor principal. Lee el DOM, inyecta los botones y oculta los elementos indeseados.
* [`background.js`](./background.js): Service Worker encargado de actualizar el contador visual.
* [`popup.html`](./popup.html) y [`popup.js`](./popup.js): Interfaz de administración e importación/exportación de datos.

## 📄 Licencia y Uso Comercial
Este proyecto está bajo una licencia de uso personal y no comercial (CC BY-NC 4.0 / PolyForm Noncommercial). 
Eres libre de descargar, inspeccionar y utilizar esta extensión para tu búsqueda de empleo personal. **La comercialización, reventa o integración de este código en productos comerciales de terceros está estrictamente prohibida sin autorización previa.** Para licencias comerciales, por favor contáctame directamente.
