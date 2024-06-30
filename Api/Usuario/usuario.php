<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, PATCH, OPTIONS");
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
        echo json_encode(array("mensaje" => "MÃ©todo invÃ¡lido"));
        break;
}

function obtenerUsuarios() {
    global $db;
    $query = "SELECT * FROM Usuarios_JRYF";
    $stmt = $db->prepare($query);
    $stmt->execute();
    //$items = `{"code":200,"message":"Usuarios Lista","data":[ $stmt->fetch(PDO::FETCH_ASSOC) ]}`;
    //$items = `{"code":200,"message":"Usuarios Lista","data":[{"id":"684","name":"ABC","email":"abc123@gmail.com","password":"900150983cd24fb0d6963f7d28e17f72"} ]}`;
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
}

function obtenerUsuario($id) {
    global $db;
    $query = "SELECT * FROM Usuarios_JRYF WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    
    if($item){
        echo json_encode($item);
    }
    else{
        echo ("El Usuario no existe");
    }
}



function crearUsuario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->nombre) || empty($data->email) || empty($data->password)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para crear el usuario."));
        return;
    }

    // Verificar si el correo ya existe
    $query = "SELECT * FROM Usuarios_JRYF WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "El correo electrónico ya está en uso."));
        return;
    }

    // Inserta el usuario con estado 'activo'
    $query = "INSERT INTO Usuarios_JRYF (nombre, email, password, estado) VALUES (:nombre, :email, :password, 'activo')";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":nombre", $data->nombre);
    $stmt->bindParam(":email", $data->email);
    $hashed_password = password_hash($data->password, PASSWORD_BCRYPT);
    $stmt->bindParam(":password", $hashed_password);

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

    $query = "UPDATE Usuarios_JRYF SET nombre = :nombre, email = :email, password = :password WHERE id = :id AND estado = 'activo'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":nombre", $data->nombre);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":password", $data->password);
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
