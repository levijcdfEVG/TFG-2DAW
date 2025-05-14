<?php 

class MFormacion {
    private $conexion;

    public function conectar(){
        $objetoBD = new bbdd(); //Conectamos a la base de datos. Creamos objeto $objetoBD
        $this->conexion = $objetoBD->conexion; //Llamamos al metodo que realiza la conexion a la BBDD
    }


    public function listarAllFormaciones() {
        try {
            $this->conectar();
    
            $sql = '
                SELECT id, lugar_imparticion, duracion, modalidad, justificacion, metodologia, docentes, dirigido_a
                FROM formacion
                WHERE activo IS FALSE;
            ';
    
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();
    
            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            if (empty($resultados)) {
                return ['success' => false, 'message' => 'No se encontraron registros.'];
            }
    
            return ['success' => true, 'data' => $resultados];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error al ejecutar la consulta: ' . $e->getMessage()];
        }
    }    


}