/**
 * @fileoverview Script de Google Apps Script que gestiona el envío automático de correos
 * electrónicos cuando un usuario es dado de alta o baja en una formación. El script se
 * ejecuta mediante solicitudes HTTP POST (Web App) y usa GmailApp para enviar los correos.
 *
 * Admite dos tipos de notificación:
 * - alta: notifica que el usuario ha sido inscrito en una formación.
 * - baja: notifica que el usuario ha sido dado de baja de una formación.
 */

/**
 * Punto de entrada principal para manejar solicitudes HTTP POST.
 * Procesa los datos recibidos y llama a la función correspondiente según el tipo.
 *
 * @param {GoogleAppsScript.Events.DoPost} e - Objeto de evento que contiene los datos de la solicitud POST.
 * @returns {GoogleAppsScript.Content.TextOutput} - Resultado del procesamiento.
 */
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);

        switch (data.tipo) {
            case 'alta':
                return enviarCorreoAlta(data);
            case 'baja':
                return enviarCorreoBaja(data);
            default:
                return ContentService.createTextOutput("Tipo de correo no soportado");
        }

    } catch (err) {
        return ContentService.createTextOutput("Error al procesar: " + err);
    }
}

/**
 * Envía un correo electrónico notificando que el usuario ha sido inscrito a una formación.
 *
 * @param {Object} data - Datos necesarios para enviar el correo.
 * @param {string} data.nombre - Nombre del usuario.
 * @param {string} data.formacion - Nombre de la formación.
 * @param {string} data.to - Dirección de correo del destinatario.
 * @param {string} data.subject - Asunto del correo.
 * @returns {GoogleAppsScript.Content.TextOutput} - Confirmación del envío.
 */
function enviarCorreoAlta(data) {
    const nombre = data.nombre || "Usuario";
    const formacion = data.formacion || "una formación";

    const plainBody = `Hola ${nombre}, has sido asignado a la formación: ${formacion}.`;
    const htmlBody = `...`; // HTML generado dinámicamente (omitido aquí por brevedad, ver código original)

    GmailApp.sendEmail(data.to, data.subject, plainBody, { htmlBody: htmlBody });
    return ContentService.createTextOutput("Correo de alta enviado con éxito.");
}

/**
 * Envía un correo electrónico notificando que el usuario ha sido dado de baja de una formación.
 *
 * @param {Object} data - Datos necesarios para enviar el correo.
 * @param {string} data.nombre - Nombre del usuario.
 * @param {string} data.formacion - Nombre de la formación.
 * @param {string} data.to - Dirección de correo del destinatario.
 * @param {string} data.subject - Asunto del correo.
 * @returns {GoogleAppsScript.Content.TextOutput} - Confirmación del envío.
 */
function enviarCorreoBaja(data) {
    const nombre = data.nombre || "Usuario";
    const formacion = data.formacion || "una formación";

    const plainBody = `Hola ${nombre}, has sido dado de baja en la formación: ${formacion}.`;
    const htmlBody = `...`; // HTML generado dinámicamente (omitido aquí por brevedad, ver código original)

    GmailApp.sendEmail(data.to, data.subject, plainBody, { htmlBody: htmlBody });
    return ContentService.createTextOutput("Correo de baja enviado con éxito.");
}
