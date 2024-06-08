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
        crearProveedor();
        break;
    case 'PUT':
        actualizarProveedor();
        break;
    case 'GET':
        isset($_GET["id"]) ? obtenerProveedor(intval($_GET["id"])) : obtenerProveedores();
        break;
    case 'DELETE':
        inactivarProveedor();
        break;
    case 'PATCH':
        activarProveedor();
        break;
    case 'OPTIONS':
        http_response_code(200);
        break;
    default:
        http_response_code(400);
        echo json_encode(array("mensaje" => "Método inválido"));
        break;
}

function obtenerProveedores() {
    global $db;
    $query = "SELECT * FROM Proveedores_JRYF";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
}

function obtenerProveedor($id) {
    global $db;
    $query = "SELECT * FROM Proveedores_JRYF WHERE id = ? AND estado = 'activo'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($item);
}

function crearProveedor() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->nombre) || empty($data->telefono) || empty($data->email)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para crear el proveedor."));
        return;
    }

    $query = "INSERT INTO Proveedores_JRYF (nombre, telefono, email, estado) VALUES (:nombre, :telefono, :email, 'activo')";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":nombre", $data->nombre);
    $stmt->bindParam(":telefono", $data->telefono);
    $stmt->bindParam(":email", $data->email);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Proveedor creado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo crear el proveedor."));
    }
}

function actualizarProveedor() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id) || empty($data->nombre) || empty($data->telefono) || empty($data->email)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para actualizar el proveedor."));
        return;
    }

    $query = "UPDATE Proveedores_JRYF SET nombre = :nombre, telefono = :telefono, email = :email WHERE id = :id AND estado = 'activo'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":nombre", $data->nombre);
    $stmt->bindParam(":telefono", $data->telefono);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Proveedor actualizado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo actualizar el proveedor."));
    }
}

function inactivarProveedor() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para inactivar el proveedor."));
        return;
    }

    $query = "UPDATE Proveedores_JRYF SET estado = 'inactivo' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Proveedor inactivado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo inactivar el proveedor."));
    }
}

function activarProveedor() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para activar el proveedor."));
        return;
    }

    $query = "UPDATE Proveedores_JRYF SET estado = 'activo' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Proveedor activado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo activar el proveedor."));
    }
}
?>
