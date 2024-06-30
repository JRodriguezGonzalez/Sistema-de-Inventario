// src/components/pages/Proveedor.js
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

const Proveedor = () => {
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getData('Proveedor/proveedor.php')
      .then((response) => {
        setProveedores(response.data);
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
      getData(`Proveedor/proveedor.php?id=${searchId}`)
        .then((response) => {
          setProveedores([response.data]);
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

  const handleAddProveedor = (newProveedor) => {
    const proveedorConEstado = { ...newProveedor, estado: 'activo' };
    createData('Proveedor/proveedor.php', proveedorConEstado)
      .then(() => {
        fetchData();
        setShowModal(false);
        setError(null);
        Swal.fire('Success', 'Proveedor agregado con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al crear datos:', error);
        setError('Error creating data. Please try again later.');
        Swal.fire('Error', 'No se pudo agregar el proveedor', 'error');
      });
  };

  const handleUpdateProveedor = (id, updatedProveedor) => {
    updateData('Proveedor/proveedor.php', id, updatedProveedor)
      .then(() => {
        fetchData();
        setShowModal(false);
        setError(null);
        Swal.fire('Success', 'Proveedor actualizado con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al actualizar datos:', error);
        setError('Error updating data. Please try again later.');
        Swal.fire('Error', 'No se pudo actualizar el proveedor', 'error');
      });
  };

  const handleDeleteProveedor = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres desactivar este proveedor?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData('Proveedor/proveedor.php', id)
          .then(() => {
            fetchData();
            setError(null);
            Swal.fire('Desactivado!', 'Proveedor desactivado con éxito', 'success');
          })
          .catch((error) => {
            console.error('Error al eliminar datos:', error);
            setError('Error eliminando datos. Por favor, inténtelo de nuevo más tarde.');
            Swal.fire('Error', 'No se pudo desactivar el proveedor', 'error');
          });
      }
    });
  };

  const handleActivateProveedor = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres activar este proveedor?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar!'
    }).then((result) => {
      if (result.isConfirmed) {
        patchData('Proveedor/proveedor.php', id, { id }) // Pasar el id en el cuerpo de la solicitud
          .then(() => {
            fetchData();
            setError(null);
            Swal.fire('Activado!', 'Proveedor activado con éxito', 'success');
          })
          .catch((error) => {
            console.error('Error al activar datos:', error);
            setError('Error activando datos. Por favor, inténtelo de nuevo más tarde.');
            Swal.fire('Error', 'No se pudo activar el proveedor', 'error');
          });
      }
    });
  };

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Nombre', accessor: 'nombre' },
    { Header: 'Teléfono', accessor: 'telefono' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Estado', accessor: 'estado' },
    { 
      Header: 'Acciones', 
      accessor: 'acciones', 
      Cell: ({ row }) => (
        <div>
          <Button 
            className="editar" 
            onClick={() => {
              setModalTitle('Editar Proveedor');
              setSelectedProveedor(row.original);
              setShowModal(true);
            }}
            style={{ marginRight: '5px' }}
          >
            <FaEdit /> Editar
          </Button>
          {row.original.estado === 'activo' ? (
            <Button 
              className="eliminar"
              onClick={() => handleDeleteProveedor(row.original.id)} 
              style={{ marginRight: '5px' }}
            >
              <FaTrash /> Eliminar
            </Button>
          ) : (
            <Button 
              className="activar"
              onClick={() => handleActivateProveedor(row.original.id)} 
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
    { name: 'telefono', label: 'Teléfono', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    // Eliminamos el campo estado para el formulario
  ];

  return (
    <div className="page-container">
      <h1>Proveedores</h1>
      <div className="action-buttons">
        <Button 
          className="agregar"
          onClick={() => {
            setModalTitle('Agregar Proveedor');
            setSelectedProveedor(null);
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
        <DataTable columns={columns} data={proveedores} />
      </div>
      <CustomModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        title={modalTitle} 
        handleSubmit={() => {
          if (selectedProveedor) {
            handleUpdateProveedor(selectedProveedor.id, selectedProveedor);
          } else {
            handleAddProveedor(selectedProveedor);
          }
        }}
      >
        <FormComponent 
          fields={fields} 
          initialValues={selectedProveedor || {}} 
          onSubmit={(values) => {
            if (selectedProveedor) {
              handleUpdateProveedor(selectedProveedor.id, values);
            } else {
              handleAddProveedor(values);
            }
          }}
        />
      </CustomModal>
    </div>
  );
};

export default Proveedor;
