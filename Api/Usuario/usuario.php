<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once "../dbConfig/database.php";

$database = new Database();
$db = $database->getConn();

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'POST':
        crearUsuario();
        break;
    case 'PUT':
        actualizarUsuario();
        break;
    case 'GET':
        isset($_GET["id"]) ? obtenerUsuario(intval($_GET["id"])) : obtenerUsuarios();
        break;
    case 'DELETE':
        inactivarUsuario();
        break;
    case 'PATCH':
        activarUsuario();
        break;
    case 'OPTIONS':
        http_response_code(200);
        break;
    default:
        http_response_code(400);
        echo json_encode(array("mensaje" => "Método inválido"));
        break;
}

function obtenerUsuarios() {
    global $db;
    $query = "SELECT * FROM Usuarios_JRYF";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
}

function obtenerUsuario($id) {
    global $db;
    $query = "SELECT * FROM Usuarios_JRYF WHERE id = ? AND estado = 'activo'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($item);
}

function crearUsuario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->nombre) || empty($data->email) || empty($data->password)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para crear el usuario."));
        return;
    }

    // Inserta el usuario con estado 'activo'
    $query = "INSERT INTO Usuarios_JRYF (nombre, email, password, estado) VALUES (:nombre, :email, :password, 'activo')";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":nombre", $data->nombre);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":password", password_hash($data->password, PASSWORD_BCRYPT));

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Usuario creado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo crear el usuario."));
    }
}

function actualizarUsuario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id) || empty($data->nombre) || empty($data->email)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para actualizar el usuario."));
        return;
    }

    $query = "UPDATE Usuarios_JRYF SET nombre = :nombre, email = :email WHERE id = :id AND estado = 'activo'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":nombre", $data->nombre);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Usuario actualizado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo actualizar el usuario."));
    }
}

function inactivarUsuario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para inactivar el usuario."));
        return;
    }

    $query = "UPDATE Usuarios_JRYF SET estado = 'inactivo' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Usuario inactivado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo inactivar el usuario."));
    }
}

function activarUsuario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para activar el usuario."));
        return;
    }

    $query = "UPDATE Usuarios_JRYF SET estado = 'activo' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Usuario activado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo activar el usuario."));
    }
}
?>
