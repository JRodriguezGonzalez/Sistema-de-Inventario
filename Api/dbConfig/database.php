<?php
/**
 * Clase Database para gestionar la conexión a la base de datos MySQL.
 */
class Database {
    // Propiedades privadas para almacenar los detalles de conexión
    private $host = "srv863.hstgr.io";
    private $password = "#5?Sf1p0Vh";
    private $username = "u484426513_multimedios012";
    private $db_name = "u484426513_multimedios012";
    public $conn;  // Propiedad pública para almacenar la conexión
    /**
     * Método para obtener la conexión a la base de datos.
     * 
     * @return PDO|null Retorna un objeto PDO si la conexión es exitosa, o null en caso contrario.
     */
    public function getConn() {
        $this->conn = null;  // Inicializa la conexión como null
        try {
            // Intenta crear una nueva conexión PDO
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");  // Asegura que la codificación de caracteres sea UTF-8
        } catch (PDOException $exception) {
            // Captura cualquier excepción y muestra un mensaje de error
            echo "Error de conexión: " . $exception->getMessage();
        }
        return $this->conn;  // Retorna el objeto de conexión o null
    }
}
?>