<?php
require_once MODELS.'mUsuario.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once 'config/config.php'; //Constantes config php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use phpseclib3\Crypt\PublicKeyLoader;
use phpseclib3\Math\BigInteger;

class cUsuario {

    //Metodos de verificacion de login
    public function loginGoogle(): array {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $modelo = new mUsuario();

            $token = $data["token"] ?? null;
            if (!$token) {
                return $this->sendResponse(["success" => false, "error" => "Token no recibido"]);
            }

            $decoded = $this->validateGoogleJWT($token);
            if (!$decoded) {
                return $this->sendResponse(["success" => false, "error" => "Token inválido o expirado"]);
            }

            $correo = $decoded['email'] ?? null;
            if (!$correo) {
                return $this->sendResponse(["success" => false, "error" => "Correo no disponible en el token"]);
            }

            $usuario = $modelo->getUsuarioPorCorreo($correo);

            if (!$usuario) {
                return $this->sendResponse(["success" => false, "error" => "Correo no autorizado"]);
            }

            return $this->sendResponse(["success" => true, "token" => $token]);

        } catch (Exception $e) {
            return $this->sendResponse(["success" => false, "error" => "Error en el servidor: " . $e->getMessage()]);
        }
    }

    private function validateGoogleJWT($token) {
        $header = json_decode(base64_decode(explode('.', $token)[0]), true);
        $kid = $header['kid'] ?? null;

        if (!$kid) {
            throw new Exception("El token no contiene 'kid'");
        }

        $certs = $this->getGoogleX509Certs();

        if (!isset($certs[$kid])) {
            throw new Exception("No se encontró certificado para el kid: $kid");
        }

        $publicKey = $certs[$kid];

        $decoded = JWT::decode($token, new Key($publicKey, 'RS256'));

        if (
            $decoded->aud !== GOOGLEID ||
            !in_array($decoded->iss, ['https://accounts.google.com', 'accounts.google.com'])
        ) {
            throw new Exception("Audiencia o emisor no válidos.");
        }

        return (array) $decoded;
    }

    private function getGoogleX509Certs() {
        $certs = file_get_contents('https://www.googleapis.com/oauth2/v1/certs');
        return json_decode($certs, true);
    }

    private function getGooglePublicKey($googleCerts) {
        foreach ($googleCerts['keys'] as $key) {
            if ($key['kid'] === $kid) {
                return $this->convertJwkToPem($key);
            }
        }
        throw new Exception("No se encontró la clave con kid: $kid");
    }

    private function convertJwkToPem($jwk) {
        $modulus = $this->base64UrlDecode($jwk['n']);
        $exponent = $this->base64UrlDecode($jwk['e']);

        $rsa = PublicKeyLoader::load([
            'n' => new BigInteger($modulus, 256),
            'e' => new BigInteger($exponent, 256)
        ]);

        return $rsa->toString('PKCS8');
    }

    private function base64UrlDecode($data) {
        $data = str_replace(['-', '_'], ['+', '/'], $data);
        return base64_decode(str_pad($data, strlen($data) % 4 ? strlen($data) + 4 - strlen($data) % 4 : strlen($data), '=', STR_PAD_RIGHT));
    }

    private function getGoogleCerts() {
        $certs = file_get_contents($this->googleCertsUrl);
        return json_decode($certs, true);
    }

    
    public function getUserByid($param): array {
        $modelo = new mUsuario();

        try {
            if (!isset($param['id'])) {
                throw new Exception("ID no proporcionado");
            }

            $id = intval($param['id']); // Asegúrate de que sea un número entero
            $usuario = $modelo->getUsuarioPorId($id);

            if (!$usuario) {
                return ["success" => false, "error" => "Usuario no encontrado"];
            }

            return ["success" => true, "usuario" => $usuario];

        } catch (Exception $e) {
            return ["success" => false, "error" => "Error en el servidor: " . $e->getMessage()];
        }
    }

    private function sendResponse($data) {
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }


}
