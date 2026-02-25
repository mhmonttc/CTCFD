chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'actualizarBadge' && sender.tab) {
        // Muestra el número en el ícono (o lo borra si es 0)
        chrome.action.setBadgeText({
            text: request.cantidad > 0 ? request.cantidad.toString() : '',
            tabId: sender.tab.id
        });
        // Le ponemos un color rojo tipo notificación
        chrome.action.setBadgeBackgroundColor({ 
            color: '#dc3545', 
            tabId: sender.tab.id 
        });
    }
});