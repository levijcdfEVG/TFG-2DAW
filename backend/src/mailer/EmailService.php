<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../../vendor/autoload.php'; 
require_once 'config/config.php';

class EmailService {
    private $mailer;

    public function __construct() {
        $this->mailer = new PHPMailer(true);

        try {
            // Configuración SMTP
            $this->mailer->isSMTP();
            $this->mailer->Host = 'smtp.gmail.com';
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = MAILERMAIL;      // Tu email
            $this->mailer->Password = MAILERPASS;         // Password de app (no la normal)
            $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mailer->Port = 587;

            $this->mailer->setFrom(MAILERMAIL, 'Gestion de Formaciones');
            $this->mailer->isHTML(true);
        } catch (Exception $e) {
            // Aquí podrías manejar errores de inicialización
            error_log('Mailer Error: ' . $e->getMessage());
        }
    }

    public function enviarCorreo($destinatario, $asunto, $cuerpoHTML) {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($destinatario);
            $this->mailer->Subject = $asunto;
            $this->mailer->Body = $cuerpoHTML;

            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log('Error enviando email: ' . $e->getMessage());
            return false;
        }
    }
}
