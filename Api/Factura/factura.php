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
        crearFactura();
        break;
    case 'PUT':
        actualizarFactura();
        break;
    case 'GET':
        isset($_GET["id"]) ? obtenerFactura(intval($_GET["id"])) : obtenerFacturas();
        break;
    case 'DELETE':
        inactivarFactura();
        break;
    case 'PATCH':
        activarFactura();
        break;
    case 'OPTIONS':
        http_response_code(200);
        break;
    default:
        http_response_code(400);
        echo json_encode(array("mensaje" => "Método inválido"));
        break;
}

function obtenerFacturas() {
    global $db;
    $query = "SELECT * FROM Facturas_JRYF WHERE estado = 'activa'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
}

function obtenerFactura($id) {
    global $db;
    $query = "SELECT * FROM Facturas_JRYF WHERE id = ? AND estado = 'activa'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($item);
}

function crearFactura() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->fecha) || empty($data->total) || empty($data->usuario_id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para crear la factura."));
        return;
    }

    $query = "INSERT INTO Facturas_JRYF (fecha, total, usuario_id, estado) VALUES (:fecha, :total, :usuario_id, 'activa')";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":fecha", $data->fecha);
    $stmt->bindParam(":total", $data->total);
    $stmt->bindParam(":usuario_id", $data->usuario_id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Factura creada."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo crear la factura."));
    }
}

function actualizarFactura() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id) || empty($data->fecha) || empty($data->total) || empty($data->usuario_id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para actualizar la factura."));
        return;
    }

    $query = "UPDATE Facturas_JRYF SET fecha = :fecha, total = :total, usuario_id = :usuario_id WHERE id = :id AND estado = 'activa'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":fecha", $data->fecha);
    $stmt->bindParam(":total", $data->total);
    $stmt->bindParam(":usuario_id", $data->usuario_id);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Factura actualizada."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo actualizar la factura."));
    }
}

function inactivarFactura() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para inactivar la factura."));
        return;
    }

    $query = "UPDATE Facturas_JRYF SET estado = 'inactiva' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Factura inactivada."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo inactivar la factura."));
    }
}

function activarFactura() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para activar la factura."));
        return;
    }

    $query = "UPDATE Facturas_JRYF SET estado = 'activa' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Factura activada."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo activar la factura."));
    }
}

?>
