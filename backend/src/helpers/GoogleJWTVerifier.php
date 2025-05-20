<?php
require_once __DIR__ . '/../../vendor/autoload.php'; // Asegúrate de que este path sea correcto

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use phpseclib3\Crypt\PublicKeyLoader;
use phpseclib3\Math\BigInteger;

class GoogleJWTVerifier {
    private static $certsUrl = 'https://www.googleapis.com/oauth2/v3/certs';

    public static function verify(string $jwt): array {
        $certs = json_decode(file_get_contents(self::$certsUrl), true);
        foreach ($certs['keys'] as $key) {
            try {
                $publicKey = PublicKeyLoader::load([
                    'n' => new BigInteger(self::base64UrlDecode($key['n']), 256),
                    'e' => new BigInteger(self::base64UrlDecode($key['e']), 256)
                ])->toString('PKCS8');

                $decoded = JWT::decode($jwt, new Key($publicKey, 'RS256'));

                if (
                    $decoded->aud !== GOOGLEID ||
                    !in_array($decoded->iss, ['https://accounts.google.com', 'accounts.google.com'])
                ) {
                    continue;
                }

                return (array) $decoded;

            } catch (Exception $e) {
                // Intenta con la siguiente clave
            }
        }

        throw new Exception('Token inválido o no verificable.');
    }

    private static function base64UrlDecode($data) {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4 ? strlen($data) + 4 - strlen($data) % 4 : strlen($data), '=', STR_PAD_RIGHT));
    }
}
