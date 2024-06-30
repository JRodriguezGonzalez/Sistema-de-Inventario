// src/components/pages/Inventario.js
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

const Inventario = () => {
  const [inventarios, setInventarios] = useState([]);
  const [selectedInventario, setSelectedInventario] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getData('Inventario/inventario.php')
      .then((response) => {
        setInventarios(response.data);
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
      getData(`Inventario/inventario.php?id=${searchId}`)
        .then((response) => {
          setInventarios([response.data]);
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

  const handleAddInventario = (newInventario) => {
    const inventarioConEstado = { ...newInventario, estado: 'disponible' };
    createData('Inventario/inventario.php', inventarioConEstado)
      .then(() => {
        fetchData();
        setShowModal(false);
        setError(null);
        Swal.fire('Éxito', 'Inventario agregado con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al crear datos:', error);
        setError('Error creating data. Please try again later.');
        Swal.fire('Error', 'No se pudo agregar el inventario', 'error');
      });
  };

  const handleUpdateInventario = (id, updatedInventario) => {
    updateData('Inventario/inventario.php', id, updatedInventario)
      .then(() => {
        fetchData();
        setShowModal(false);
        setError(null);
        Swal.fire('Éxito', 'Inventario actualizado con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al actualizar datos:', error);
        setError('Error updating data. Please try again later.');
        Swal.fire('Error', 'No se pudo actualizar el inventario', 'error');
      });
  };

  const handleDeleteInventario = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres desactivar este inventario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData('Inventario/inventario.php', id)
          .then(() => {
            fetchData();
            setError(null);
            Swal.fire('Desactivado!', 'Inventario desactivado con éxito', 'success');
          })
          .catch((error) => {
            console.error('Error al eliminar datos:', error);
            setError('Error eliminando datos. Por favor, inténtelo de nuevo más tarde.');
            Swal.fire('Error', 'No se pudo desactivar el inventario', 'error');
          });
      }
    });
  };

  const handleActivateInventario = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres activar este inventario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar!'
    }).then((result) => {
      if (result.isConfirmed) {
        patchData('Inventario/inventario.php', id, { id }) // Pasar el id en el cuerpo de la solicitud
          .then(() => {
            fetchData();
            setError(null);
            Swal.fire('Activado!', 'Inventario activado con éxito', 'success');
          })
          .catch((error) => {
            console.error('Error al activar datos:', error);
            setError('Error activando datos. Por favor, inténtelo de nuevo más tarde.');
            Swal.fire('Error', 'No se pudo activar el inventario', 'error');
          });
      }
    });
  };

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'ID Producto', accessor: 'idProducto' },
    { Header: 'Cantidad', accessor: 'cantidad' },
    { Header: 'Fecha Registro', accessor: 'fechaRegistro' },
    { Header: 'ID Usuario', accessor: 'idUsuario' },
    { Header: 'Estado', accessor: 'estado' },
    { 
      Header: 'Acciones', 
      accessor: 'acciones', 
      Cell: ({ row }) => (
        <div>
          <Button 
            className="editar" 
            onClick={() => {
              setModalTitle('Editar Inventario');
              setSelectedInventario(row.original);
              setShowModal(true);
            }}
            style={{ marginRight: '5px' }}
          >
            <FaEdit /> Editar
          </Button>
          {row.original.estado === 'disponible' ? (
            <Button 
              className="eliminar"
              onClick={() => handleDeleteInventario(row.original.id)} 
              style={{ marginRight: '5px' }}
            >
              <FaTrash /> Eliminar
            </Button>
          ) : (
            <Button 
              className="activar"
              onClick={() => handleActivateInventario(row.original.id)} 
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
    { name: 'idProducto', label: 'ID Producto', type: 'text' },
    { name: 'cantidad', label: 'Cantidad', type: 'number' },
    { name: 'fechaRegistro', label: 'Fecha Registro', type: 'date' },
    { name: 'idUsuario', label: 'ID Usuario', type: 'text' },
    // Eliminamos el campo estado para el formulario
  ];

  return (
    <div className="page-container">
      <h1>Inventarios</h1>
      <div className="action-buttons">
        <Button 
          className="agregar"
          onClick={() => {
            setModalTitle('Agregar Inventario');
            setSelectedInventario(null);
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
        <DataTable columns={columns} data={inventarios} />
      </div>
      <CustomModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        title={modalTitle} 
        handleSubmit={() => {
          if (selectedInventario) {
            handleUpdateInventario(selectedInventario.id, selectedInventario);
          } else {
            handleAddInventario(selectedInventario);
          }
        }}
      >
        <FormComponent 
          fields={fields} 
          initialValues={selectedInventario || {}} 
          onSubmit={(values) => {
            if (selectedInventario) {
              handleUpdateInventario(selectedInventario.id, values);
            } else {
              handleAddInventario(values);
            }
          }}
        />
      </CustomModal>
    </div>
  );
};

export default Inventario;
