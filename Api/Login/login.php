<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once "../dbConfig/database.php";

$database = new Database();
$db = $database->getConn();

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'POST':
        authenticateUser();
        break;
    case 'OPTIONS':
        http_response_code(200);
        break;
    default:
        http_response_code(400);
        echo json_encode(array("mensaje" => "Método inválido"));
        break;
}

function authenticateUser() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->email) || empty($data->password)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para autenticar el usuario."));
        return;
    }

    $query = "SELECT * FROM Usuarios_JRYF WHERE email = ? AND estado = 'activo'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $data->email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($data->password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        echo json_encode(array("mensaje" => "Autenticación exitosa."));
    } else {
        http_response_code(401);
        echo json_encode(array("mensaje" => "Email o contraseña incorrectos."));
    }
}
?>
