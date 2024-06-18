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
        crearProducto();
        break;
    case 'PUT':
        actualizarProducto();
        break;
    case 'GET':
        isset($_GET["id"]) ? obtenerProducto(intval($_GET["id"])) : obtenerProductos();
        break;
    case 'DELETE':
        inactivarProducto();
        break;
    case 'PATCH':
        activarProducto();
        break;
    case 'OPTIONS':
        http_response_code(200);
        break;
    default:
        http_response_code(400);
        echo json_encode(array("mensaje" => "Método inválido"));
        break;
}

function obtenerProductos() {
    global $db;
    $query = "SELECT * FROM Productos_JRYF";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
}

function obtenerProducto($id) {
    global $db;
    $query = "SELECT * FROM Productos_JRYF WHERE id = ? AND estado = 'disponible'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $query = "SELECT estado FROM Productos_JRYF WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    $estado = $stmt->fetchColumn();
    
    if($estado == "activo"){
        echo json_encode($item);
    }
    else{
        echo ("El producto no existe");
    }
}

function crearProducto() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->nombre) || empty($data->descripcion) || empty($data->precio) || empty($data->idCategoria)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para crear el producto."));
        return;
    }

    $query = "INSERT INTO Productos_JRYF (nombre, descripcion, precio, idCategoria, proveedor_id, estado) VALUES (:nombre, :descripcion, :precio, :idCategoria, :proveedor_id, 'activo')";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":nombre", $data->nombre);
    $stmt->bindParam(":descripcion", $data->descripcion);
    $stmt->bindParam(":precio", $data->precio);
    $stmt->bindParam(":idCategoria", $data->idCategoria);
    $stmt->bindParam(":proveedor_id", $data->proveedor_id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Producto creado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo crear el producto."));
    }
}

function actualizarProducto() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id) || empty($data->nombre) || empty($data->descripcion) || empty($data->precio) || empty($data->idCategoria)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Faltan datos para actualizar el producto."));
        return;
    }

    $query = "UPDATE Productos_JRYF SET nombre = :nombre, descripcion = :descripcion, precio = :precio, idCategoria = :idCategoria, proveedor_id = :proveedor_id WHERE id = :id AND estado = 'activo'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":nombre", $data->nombre);
    $stmt->bindParam(":descripcion", $data->descripcion);
    $stmt->bindParam(":precio", $data->precio);
    $stmt->bindParam(":idCategoria", $data->idCategoria);
    $stmt->bindParam(":proveedor_id", $data->proveedor_id);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Producto actualizado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo actualizar el producto."));
    }
}

function inactivarProducto() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para inactivar el producto."));
        return;
    }

    $query = "UPDATE Productos_JRYF SET estado = 'inactivo' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Producto inactivado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo inactivar el producto."));
    }
}

function activarProducto() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(array("mensaje" => "Falta el ID para activar el producto."));
        return;
    }

    $query = "UPDATE Productos_JRYF SET estado = 'activo' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("mensaje" => "Producto activado."));
    } else {
        http_response_code(500);
        echo json_encode(array("mensaje" => "No se pudo activar el producto."));
    }
}
?>
