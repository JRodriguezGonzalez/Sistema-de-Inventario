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
        crearMovInventario();
        break;
    case 'PUT':
        actualizarMovInventario();
        break;
    case 'GET':
        isset($_GET["id"]) ? obtenerMovInventario(intval($_GET["id"])) : obtenerMovInventarios();
        break;
    case 'DELETE':
        inactivarMovInventario();
        break;
    case 'PATCH':
        activarMovInventario();
        break;
    case 'OPTIONS':
        http_response_code(200);
        break;
    default:
        http_response_code(400);
        echo json_encode(array("mensaje" => "Método inválido"));
        break;
}

function obtenerMovInventarios() {
    global $db;
    $query = "SELECT * FROM movimientosInventario_JRYF";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
}

function obtenerMovInventario($id) {
    global $db;
    $query = "SELECT * FROM movimientosInventario_JRYF WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if($item) {
        echo json_encode($item);
    } else {
        http_response_code(404);
        echo json_encode(array("mensaje" => "El movimiento de inventario no existe"));
    }
}

function crearMovInventario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->idInventario) || empty($data->fechaMovimiento) || empty($data->tipoMovimiento) || empty($data->cantidad) || empty($data->detalle)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para crear el movimiento de inventario."));
        return;
    }

    $query = "INSERT INTO movimientosInventario_JRYF (idInventario, fechaMovimiento, tipoMovimiento, cantidad, detalle , estado) VALUES (:idInventario, :fechaMovimiento, :tipoMovimiento, :cantidad, :detalle, 'activo')";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":idInventario", $data->idInventario);
    $stmt->bindParam(":fechaMovimiento", $data->fechaMovimiento);
    $stmt->bindParam(":tipoMovimiento", $data->tipoMovimiento);
    $stmt->bindParam(":cantidad", $data->cantidad);
    $stmt->bindParam(":detalle", $data->detalle);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Movimiento de inventario creado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo crear el movimiento de inventario."));
    }
}

function actualizarMovInventario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id) || empty($data->idInventario) || empty($data->fechaMovimiento) || empty($data->tipoMovimiento) || empty($data->cantidad) || empty($data->detalle)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para actualizar el movimiento de inventario."));
        return;
    }

    $query = "UPDATE movimientosInventario_JRYF SET idInventario = :idInventario, fechaMovimiento = :fechaMovimiento, tipoMovimiento = :tipoMovimiento, cantidad = :cantidad, detalle = :detalle WHERE id = :id AND estado = 'activo'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":idInventario", $data->idInventario);
    $stmt->bindParam(":fechaMovimiento", $data->fechaMovimiento);
    $stmt->bindParam(":tipoMovimiento", $data->tipoMovimiento);
    $stmt->bindParam(":cantidad", $data->cantidad);
    $stmt->bindParam(":detalle", $data->detalle);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Movimiento de inventario actualizado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo actualizar el movimiento de inventario."));
    }
}

function inactivarMovInventario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para inactivar el movimiento de inventario."));
        return;
    }

    $query = "UPDATE movimientosInventario_JRYF SET estado = 'inactivo' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Movimiento de inventario inactivado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo inactivar el movimiento de inventario."));
    }
}

function activarMovInventario() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para activar el movimiento de inventario."));
        return;
    }

    $query = "UPDATE movimientosInventario_JRYF SET estado = 'activo' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Movimiento de inventario activado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo activar el movimiento de inventario."));
    }
}
?>
