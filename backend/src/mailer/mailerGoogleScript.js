/**
 * @fileoverview Script de Google Apps Script que gestiona el envío automático de correos
 * electrónicos para notificaciones de usuarios en la Plataforma de Formaciones de la Fundación Loyola.
 * El script se ejecuta mediante solicitudes HTTP POST (Web App) y usa GmailApp para enviar los correos.
 *
 * Tipos de notificaciones soportados:
 * - alta: usuario asignado a una formación.
 * - baja: usuario dado de baja en una formación.
 * - nuevo: bienvenida a un nuevo usuario.
 * - bajaUser: baja de usuario en la plataforma.
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

        switch(data.tipo) {
            case 'alta':
                return enviarCorreoAlta(data);
            case 'baja':
                return enviarCorreoBaja(data);
            case 'nuevo':
                return enviarCorreoNuevoUser(data);
            case 'bajaUser':
                return enviarCorreoBajaUser(data);
            default:
                return ContentService.createTextOutput("Tipo de correo no soportado");
        }

    } catch (err) {
        return ContentService.createTextOutput("Error al procesar: " + err);
    }
}

/**
 * Envía un correo notificando que el usuario ha sido inscrito en una formación.
 *
 * @param {Object} data - Datos para el correo.
 * @param {string} data.nombre - Nombre del usuario.
 * @param {string} data.formacion - Nombre de la formación.
 * @param {string} data.to - Email destinatario.
 * @param {string} data.subject - Asunto del correo.
 * @returns {GoogleAppsScript.Content.TextOutput} Confirmación del envío.
 */
function enviarCorreoAlta(data) {
    const nombre = data.nombre || "Usuario";
    const formacion = data.formacion || "una formación";

    const plainBody = `Hola ${nombre}, has sido asignado a la formación: ${formacion}.`;
    const htmlBody = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8" /><style>
      body, p, h2 { margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333; text-align: left; }
      body { background: #f4f7fa; padding: 20px; }
      .container { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px; }
      h2 { color: #2c3e50; margin-bottom: 20px; }
      p { font-size: 16px; line-height: 1.5; margin-bottom: 20px; }
      .footer { font-size: 12px; color: #999; margin-top: 30px; }
    </style></head>
    <body>
      <div class="container">
        <h2>¡Hola ${nombre}!</h2>
        <p>Has sido inscrito en la formación: <strong>${formacion}</strong>.</p>
        <p>Le deseamos que saque el máximo provecho de la misma.</p>
        <p class="footer">Este mensaje fue enviado automáticamente. Por favor, no responda a este correo.</p>
      </div>
    </body>
    </html>
  `;

    GmailApp.sendEmail(data.to, data.subject, plainBody, {htmlBody});
    return ContentService.createTextOutput("Correo de alta enviado con éxito.");
}

/**
 * Envía un correo notificando que el usuario ha sido dado de baja en una formación.
 *
 * @param {Object} data - Datos para el correo.
 * @param {string} data.nombre - Nombre del usuario.
 * @param {string} data.formacion - Nombre de la formación.
 * @param {string} data.to - Email destinatario.
 * @param {string} data.subject - Asunto del correo.
 * @returns {GoogleAppsScript.Content.TextOutput} Confirmación del envío.
 */
function enviarCorreoBaja(data) {
    const nombre = data.nombre || "Usuario";
    const formacion = data.formacion || "una formación";

    const plainBody = `Hola ${nombre}, has sido dado de baja en la formación: ${formacion}.`;
    const htmlBody = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8" /><style>
      body, p, h2 { margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333; text-align: left; }
      body { background: #fff0f0; padding: 20px; }
      .container { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px; }
      h2 { color: #2c3e50; margin-bottom: 20px; }
      p { font-size: 16px; line-height: 1.5; margin-bottom: 20px; }
      .footer { font-size: 12px; color: #999; margin-top: 30px; }
    </style></head>
    <body>
      <div class="container">
        <h2>Hola ${nombre}</h2>
        <p>Has sido dado de baja en la formación: <strong>${formacion}</strong>.</p>
        <p>Si crees que es un error, contacta con administración.</p>
        <p class="footer">Este mensaje fue enviado automáticamente. Por favor, no responda a este correo.</p>
      </div>
    </body>
    </html>
  `;

    GmailApp.sendEmail(data.to, data.subject, plainBody, {htmlBody});
    return ContentService.createTextOutput("Correo de baja enviado con éxito.");
}

/**
 * Envía un correo de bienvenida a un nuevo usuario de la plataforma.
 *
 * @param {Object} data - Datos para el correo.
 * @param {string} data.nombre - Nombre del usuario.
 * @param {string} data.to - Email destinatario.
 * @param {string} data.subject - Asunto del correo.
 * @returns {GoogleAppsScript.Content.TextOutput} Confirmación del envío.
 */
function enviarCorreoNuevoUser(data) {
    const nombre = data.nombre || "Usuario";

    const plainBody = `Hola ${nombre},
Bienvenido/a a la Plataforma de Formaciones de la Fundación Loyola.

A partir de ahora, puedes acceder a la intranet de formaciones utilizando tu correo institucional.

Explora las formaciones disponibles, inscríbete y sigue tu progreso de manera sencilla y centralizada.

Si tienes alguna duda, no dudes en contactar con el equipo de administración.

Un saludo,
Fundación Loyola`;

    const htmlBody = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <style>
      body, p, h2 { margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333; text-align: left; }
      body { background: #f4f8fb; padding: 20px; }
      .container { background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px; }
      h2 { color: #2c3e50; margin-bottom: 20px; }
      p { font-size: 16px; line-height: 1.5; margin-bottom: 20px; }
      .footer { font-size: 12px; color: #999; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Hola ${nombre},</h2>
      <p>Te damos la bienvenida a la <strong>Plataforma de Formaciones de la Fundación Loyola</strong>.</p>
      <p>Ya puedes acceder a la intranet de formaciones usando tu <strong>correo institucional</strong>.</p>
      <p>Desde allí podrás:</p>
      <ul>
        <li>Consultar las formaciones activas.</li>
        <li>Inscribirte a nuevas formaciones.</li>
        <li>Ver tu historial y progreso.</li>
      </ul>
      <p>Si tienes cualquier duda, contacta con el equipo de administración.</p>
      <p class="footer">Este mensaje fue enviado automáticamente. Por favor, no respondas a este correo.</p>
    </div>
  </body>
  </html>
  `;

    GmailApp.sendEmail(data.to, data.subject, plainBody, {htmlBody});
    return ContentService.createTextOutput("Correo de bienvenida enviado con éxito.");
}

/**
 * Envía un correo notificando que el usuario ha sido dado de baja en la plataforma.
 *
 * @param {Object} data - Datos para el correo.
 * @param {string} data.nombre - Nombre del usuario.
 * @param {string} data.to - Email destinatario.
 * @param {string} data.subject - Asunto del correo.
 * @returns {GoogleAppsScript.Content.TextOutput} Confirmación del envío.
 */
function enviarCorreoBajaUser(data) {
    const nombre = data.nombre || "Usuario";

    const plainBody = `Hola ${nombre},

Tu usuario ha sido dado de baja de la Plataforma de Formaciones de la Fundación Loyola.

Si consideras que se trata de un error, contacta con el equipo de administración.

Un saludo,
Fundación Loyola`;

    const htmlBody = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <style>
        body, p, h2 {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          color: #333;
          text-align: left;
        }
        body {
          background: #fff5f5;
          padding: 20px;
        }
        .container {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 30px;
        }
        h2 {
          color: #c0392b;
          margin-bottom: 20px;
        }
        p {
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .footer {
          font-size: 12px;
          color: #999;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hola ${nombre},</h2>
        <p>Tu usuario ha sido dado de baja de la <strong>Plataforma de Formaciones de la Fundación Loyola</strong>.</p>
        <p>Si consideras que se trata de un error, contacta con el equipo de administración.</p>
        <p class="footer">Este mensaje fue enviado automáticamente. Por favor, no respondas a este correo.</p>
      </div>
    </body>
    </html>
  `;

    GmailApp.sendEmail(data.to, data.subject, plainBody, {htmlBody});
    return ContentService.createTextOutput("Correo de baja de usuario enviado con éxito.");
}
