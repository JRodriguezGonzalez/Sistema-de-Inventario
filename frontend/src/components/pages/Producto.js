// src/components/pages/Producto.js
import React, { useEffect, useState } from 'react';
import NavBar from '../common/NavBar';
import DataTable from '../common/DataTable';
import FormComponent from '../common/FormComponent';
import CustomModal from '../common/Modal';
import { getData, createData, updateData, deleteData, patchData } from '../../services/apiService';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import '../../styles/pagesStyle.css'; // Importar el archivo de estilos

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getData('Producto/Producto.php')
      .then((response) => {
        setProductos(response.data);
        setSearchId(''); // Limpiar campo de búsqueda
        setError(null);
      })
      .catch((error) => {
        console.error('Error al obtener datos:', error);
        setError('Error fetching data. Please try again later.');
      });
  };

  const handleSearch = () => {
    if (searchId) {
      getData(`Producto/Producto.php?id=${searchId}`)
        .then((response) => {
          setProductos([response.data]);
          setError(null);
        })
        .catch((error) => {
          console.error('Error al obtener datos:', error);
          setError('Error fetching data. Please try again later.');
        });
    } else {
      fetchData();
    }
  };

  const handleAddProducto = (newProducto) => {
    const productoConEstado = { ...newProducto, estado: 'disponible' };
    createData('Producto/Producto.php', productoConEstado)
      .then(() => {
        fetchData();
        setShowModal(false);
        setError(null);
        Swal.fire('Éxito', 'Producto agregado con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al crear datos:', error);
        setError('Error creating data. Please try again later.');
        Swal.fire('Error', 'No se pudo agregar el producto', 'error');
      });
  };

  const handleUpdateProducto = (id, updatedProducto) => {
    updateData('Producto/Producto.php', id, updatedProducto)
      .then(() => {
        fetchData();
        setShowModal(false);
        setError(null);
        Swal.fire('Éxito', 'Producto actualizado con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al actualizar datos:', error);
        setError('Error updating data. Please try again later.');
        Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
      });
  };

  const handleDeleteProducto = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres desactivar este producto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData('Producto/Producto.php', id)
          .then(() => {
            fetchData();
            setError(null);
            Swal.fire('Desactivado!', 'Producto desactivado con éxito', 'success');
          })
          .catch((error) => {
            console.error('Error al eliminar datos:', error);
            setError('Error eliminando datos. Por favor, inténtelo de nuevo más tarde.');
            Swal.fire('Error', 'No se pudo desactivar el producto', 'error');
          });
      }
    });
  };

  const handleActivateProducto = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres activar este producto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar!'
    }).then((result) => {
      if (result.isConfirmed) {
        patchData('Producto/Producto.php', id)
          .then(() => {
            fetchData();
            setError(null);
            Swal.fire('Activado!', 'Producto activado con éxito', 'success');
          })
          .catch((error) => {
            console.error('Error al activar datos:', error);
            setError('Error activando datos. Por favor, inténtelo de nuevo más tarde.');
            Swal.fire('Error', 'No se pudo activar el producto', 'error');
          });
      }
    });
  };

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Nombre', accessor: 'nombre' },
    { Header: 'Descripción', accessor: 'descripcion' },
    { Header: 'Precio', accessor: 'precio' },
    { Header: 'ID Categoría', accessor: 'idCategoria' },
    { Header: 'ID Proveedor', accessor: 'proveedor_id' },
    { Header: 'Estado', accessor: 'estado' },
    { 
      Header: 'Acciones', 
      accessor: 'acciones', 
      Cell: ({ row }) => (
        <div>
          <Button 
            className="editar" 
            onClick={() => {
              setModalTitle('Editar Producto');
              setSelectedProducto(row.original);
              setShowModal(true);
            }}
            style={{ marginRight: '5px' }}
          >
            <FaEdit /> Editar
          </Button>
          {row.original.estado === 'disponible' ? (
            <Button 
              className="eliminar"
              onClick={() => handleDeleteProducto(row.original.id)} 
              style={{ marginRight: '5px' }}
            >
              <FaTrash /> Eliminar
            </Button>
          ) : (
            <Button 
              className="activar"
              onClick={() => handleActivateProducto(row.original.id)} 
              style={{ marginRight: '5px' }}
            >
              <FaCheck /> Activar
            </Button>
          )}
        </div>
      ) 
    }
  ];

  const fields = [
    { name: 'nombre', label: 'Nombre', type: 'text' },
    { name: 'descripcion', label: 'Descripción', type: 'text' },
    { name: 'precio', label: 'Precio', type: 'number' },
    { name: 'idCategoria', label: 'ID Categoría', type: 'text' },
    { name: 'proveedor_id', label: 'ID Proveedor', type: 'text' },
  ];

  return (
    <div className="page-container">
      <h1>Productos</h1>
      <div className="action-buttons">
        <Button 
          className="agregar"
          onClick={() => {
            setModalTitle('Agregar Producto');
            setSelectedProducto(null);
            setShowModal(true);
          }}
        >
          Agregar
        </Button>
        <input 
          type="text" 
          value={searchId} 
          onChange={(e) => setSearchId(e.target.value)} 
          placeholder="Buscar por ID" 
          className="buscar-input"
        />
        <Button className="buscar" onClick={handleSearch}>Buscar</Button>
        <Button className="mostrar-todos" onClick={fetchData}>Mostrar Todos</Button>
      </div>
      <div className="table-container">
        {error && <p className="error-message">{error}</p>}
        <DataTable columns={columns} data={productos} />
      </div>
      <CustomModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        title={modalTitle} 
        handleSubmit={() => {
          if (selectedProducto) {
            handleUpdateProducto(selectedProducto.id, selectedProducto);
          } else {
            handleAddProducto(selectedProducto);
          }
        }}
      >
        <FormComponent 
          fields={fields} 
          initialValues={selectedProducto || {}} 
          onSubmit={(values) => {
            if (selectedProducto) {
              handleUpdateProducto(selectedProducto.id, values);
            } else {
              handleAddProducto(values);
            }
          }}
        />
      </CustomModal>
    </div>
  );
};

export default Producto;
