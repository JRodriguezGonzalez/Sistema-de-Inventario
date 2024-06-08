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
        crearDetalleFactura();
        break;
    case 'PUT':
        actualizarDetalleFactura();
        break;
    case 'GET':
        isset($_GET["id"]) ? obtenerDetalleFactura(intval($_GET["id"])) : obtenerDetallesFactura();
        break;
    case 'DELETE':
        inactivarDetalleFactura();
        break;
    case 'PATCH':
        activarDetalleFactura();
        break;
    case 'OPTIONS':
        http_response_code(200);
        break;
    default:
        http_response_code(400);
        echo json_encode(array("mensaje" => "Método inválido"));
        break;
}

function obtenerDetallesFactura() {
    global $db;
    $query = "SELECT * FROM Detalles_Factura_JRYF WHERE estado = 'activo'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
}

function obtenerDetalleFactura($id) {
    global $db;
    $query = "SELECT * FROM Detalles_Factura_JRYF WHERE id = ? AND estado = 'activo'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($item);
}

function crearDetalleFactura() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->factura_id) || empty($data->producto_id) || empty($data->cantidad) || empty($data->precio_unitario)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para crear el detalle de factura."));
        return;
    }

    // Calcular el total del detalle
    $total_detalle = $data->cantidad * $data->precio_unitario;

    // Obtener el total de la factura relacionada
    $query = "SELECT total FROM Facturas_JRYF WHERE id = :factura_id AND estado = 'activa'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":factura_id", $data->factura_id);
    $stmt->execute();

    if ($stmt->rowCount() == 0) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Factura no encontrada o inactiva."));
        return;
    }

    $factura = $stmt->fetch(PDO::FETCH_ASSOC);
    $total_factura = $factura['total'];

    // Obtener el total actual de los detalles de la factura
    $query = "SELECT SUM(cantidad * precio_unitario) as total_detalles FROM Detalles_Factura_JRYF WHERE factura_id = :factura_id AND estado = 'activo'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":factura_id", $data->factura_id);
    $stmt->execute();
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    $total_detalles_actual = $resultado['total_detalles'] ? $resultado['total_detalles'] : 0;

    // Verificar si el nuevo detalle no excede el total de la factura
    if ($total_detalles_actual + $total_detalle > $total_factura) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "El total de los detalles excede el total de la factura."));
        return;
    }

    // Insertar el nuevo detalle de factura
    $query = "INSERT INTO Detalles_Factura_JRYF (factura_id, producto_id, cantidad, precio_unitario, estado) VALUES (:factura_id, :producto_id, :cantidad, :precio_unitario, 'activo')";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":factura_id", $data->factura_id);
    $stmt->bindParam(":producto_id", $data->producto_id);
    $stmt->bindParam(":cantidad", $data->cantidad);
    $stmt->bindParam(":precio_unitario", $data->precio_unitario);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Detalle de factura creado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo crear el detalle de factura."));
    }
}

function actualizarDetalleFactura() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id) || empty($data->factura_id) || empty($data->producto_id) || empty($data->cantidad) || empty($data->precio_unitario)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para actualizar el detalle de factura."));
        return;
    }

    // Calcular el total del detalle actualizado
    $total_detalle = $data->cantidad * $data->precio_unitario;

    // Obtener el total de la factura relacionada
    $query = "SELECT total FROM Facturas_JRYF WHERE id = :factura_id AND estado = 'activa'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":factura_id", $data->factura_id);
    $stmt->execute();

    if ($stmt->rowCount() == 0) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Factura no encontrada o inactiva."));
        return;
    }

    $factura = $stmt->fetch(PDO::FETCH_ASSOC);
    $total_factura = $factura['total'];

    // Obtener el total actual de los detalles de la factura excluyendo el detalle que se está actualizando
    $query = "SELECT SUM(cantidad * precio_unitario) as total_detalles FROM Detalles_Factura_JRYF WHERE factura_id = :factura_id AND estado = 'activo' AND id != :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":factura_id", $data->factura_id);
    $stmt->bindParam(":id", $data->id);
    $stmt->execute();
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    $total_detalles_actual = $resultado['total_detalles'] ? $resultado['total_detalles'] : 0;

    // Verificar si el detalle actualizado no excede el total de la factura
    if ($total_detalles_actual + $total_detalle > $total_factura) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "El total de los detalles excede el total de la factura."));
        return;
    }

    // Actualizar el detalle de factura
    $query = "UPDATE Detalles_Factura_JRYF SET factura_id = :factura_id, producto_id = :producto_id, cantidad = :cantidad, precio_unitario = :precio_unitario WHERE id = :id AND estado = 'activo'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":factura_id", $data->factura_id);
    $stmt->bindParam(":producto_id", $data->producto_id);
    $stmt->bindParam(":cantidad", $data->cantidad);
    $stmt->bindParam(":precio_unitario", $data->precio_unitario);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Detalle de factura actualizado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo actualizar el detalle de factura."));
    }
}

function inactivarDetalleFactura() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para inactivar el detalle de factura."));
        return;
    }

    $query = "UPDATE Detalles_Factura_JRYF SET estado = 'inactivo' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Detalle de factura inactivado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo inactivar el detalle de factura."));
    }
}

function activarDetalleFactura() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para activar el detalle de factura."));
        return;
    }

    $query = "UPDATE Detalles_Factura_JRYF SET estado = 'activo' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Detalle de factura activado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo activar el detalle de factura."));
    }
}

?>
