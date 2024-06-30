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
        crearInventario();
        break;
    case 'PUT':
        actualizarInventario();
        break;
    case 'GET':
        isset($_GET["id"]) ? obtenerInventario(intval($_GET["id"])) : obtenerInventarios();
        break;
    case 'DELETE':
        inactivarInventario();
        break;
    case 'PATCH':
        activarInventario();
        break;
    case 'OPTIONS':
        http_response_code(200);
        break;
    default:
        http_response_code(400);
        echo json_encode(array("mensaje" => "Método inválido"));
        break;
}

function obtenerInventarios() {
    global $db;
    $query = "SELECT * FROM Inventario_JRYF";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
}

function obtenerInventario($id) {
    global $db;
    $query = "SELECT * FROM Inventario_JRYF WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if($item) {
        echo json_encode($item);
    } else {
        http_response_code(404);
        echo json_encode(array("mensaje" => "El inventario no existe"));
    }
}

function crearInventario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->idProducto) || empty($data->cantidad) || empty($data->fechaRegistro) || empty($data->idUsuario)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para crear el inventario."));
        return;
    }

    $query = "INSERT INTO Inventario_JRYF (idProducto, cantidad, fechaRegistro, idUsuario, estado) VALUES (:idProducto, :cantidad, :fechaRegistro, :idUsuario, 'disponible')";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":idProducto", $data->idProducto);
    $stmt->bindParam(":cantidad", $data->cantidad);
    $stmt->bindParam(":fechaRegistro", $data->fechaRegistro);
    $stmt->bindParam(":idUsuario", $data->idUsuario);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Inventario creado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo crear el inventario."));
    }
}

function actualizarInventario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id) || empty($data->idProducto) || empty($data->cantidad) || empty($data->fechaRegistro) || empty($data->idUsuario)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para actualizar el inventario."));
        return;
    }

    $query = "UPDATE Inventario_JRYF SET idProducto = :idProducto, cantidad = :cantidad, fechaRegistro = :fechaRegistro, idUsuario = :idUsuario WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":idProducto", $data->idProducto);
    $stmt->bindParam(":cantidad", $data->cantidad);
    $stmt->bindParam(":fechaRegistro", $data->fechaRegistro);
    $stmt->bindParam(":idUsuario", $data->idUsuario);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Inventario actualizado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo actualizar el inventario."));
    }
}

function inactivarInventario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para inactivar el inventario."));
        return;
    }

    $query = "UPDATE Inventario_JRYF SET estado = 'no disponible' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Inventario inactivado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo inactivar el inventario."));
    }
}

function activarInventario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para activar el inventario."));
        return;
    }

    $query = "UPDATE Inventario_JRYF SET estado = 'disponible' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Inventario activado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo activar el inventario."));
    }
}
?>
