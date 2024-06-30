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

const MovimientoInventario = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getData('movimientoInventario/movimientoinventario.php')
      .then((response) => {
        setMovimientos(response.data);
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
      getData(`movimientoInventario/movimientoinventario.php?id=${searchId}`)
        .then((response) => {
          setMovimientos([response.data]);
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

  const handleAddMovimiento = (newMovimiento) => {
    const movimientoConEstado = { ...newMovimiento, estado: 'activo' };
    createData('movimientoInventario/movimientoinventario.php', movimientoConEstado)
      .then(() => {
        fetchData();
        setShowModal(false);
        setError(null);
        Swal.fire('Éxito', 'Movimiento de inventario agregado con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al crear datos:', error);
        setError('Error creating data. Please try again later.');
        Swal.fire('Error', 'No se pudo agregar el movimiento de inventario', 'error');
      });
  };

  const handleUpdateMovimiento = (id, updatedMovimiento) => {
    updateData('movimientoInventario/movimientoinventario.php', id, updatedMovimiento)
      .then(() => {
        fetchData();
        setShowModal(false);
        setError(null);
        Swal.fire('Éxito', 'Movimiento de inventario actualizado con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al actualizar datos:', error);
        setError('Error updating data. Please try again later.');
        Swal.fire('Error', 'No se pudo actualizar el movimiento de inventario', 'error');
      });
  };

  const handleDeleteMovimiento = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres desactivar este movimiento de inventario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData('movimientoInventario/movimientoinventario.php', id)
          .then(() => {
            fetchData();
            setError(null);
            Swal.fire('Desactivado!', 'Movimiento de inventario desactivado con éxito', 'success');
          })
          .catch((error) => {
            console.error('Error al eliminar datos:', error);
            setError('Error eliminando datos. Por favor, inténtelo de nuevo más tarde.');
            Swal.fire('Error', 'No se pudo desactivar el movimiento de inventario', 'error');
          });
      }
    });
  };

  const handleActivateMovimiento = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres activar este movimiento de inventario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar!'
    }).then((result) => {
      if (result.isConfirmed) {
        patchData('movimientoInventario/movimientoinventario.php', id)
          .then(() => {
            fetchData();
            setError(null);
            Swal.fire('Activado!', 'Movimiento de inventario activado con éxito', 'success');
          })
          .catch((error) => {
            console.error('Error al activar datos:', error);
            setError('Error activando datos. Por favor, inténtelo de nuevo más tarde.');
            Swal.fire('Error', 'No se pudo activar el movimiento de inventario', 'error');
          });
      }
    });
  };

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'ID Inventario', accessor: 'idInventario' },
    { Header: 'Fecha Movimiento', accessor: 'fechaMovimiento' },
    { Header: 'Tipo Movimiento', accessor: 'tipoMovimiento' },
    { Header: 'Cantidad', accessor: 'cantidad' },
    { Header: 'Detalle', accessor: 'detalle' },
    { Header: 'Estado', accessor: 'estado' },
    { 
      Header: 'Acciones', 
      accessor: 'acciones', 
      Cell: ({ row }) => (
        <div>
          <Button 
            className="editar" 
            onClick={() => {
              setModalTitle('Editar Movimiento de Inventario');
              setSelectedMovimiento(row.original);
              setShowModal(true);
            }}
            style={{ marginRight: '5px' }}
          >
            <FaEdit /> Editar
          </Button>
          {row.original.estado === 'activo' ? (
            <Button 
              className="eliminar"
              onClick={() => handleDeleteMovimiento(row.original.id)} 
              style={{ marginRight: '5px' }}
            >
              <FaTrash /> Eliminar
            </Button>
          ) : (
            <Button 
              className="activar"
              onClick={() => handleActivateMovimiento(row.original.id)} 
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
    { name: 'idInventario', label: 'ID Inventario', type: 'text' },
    { name: 'fechaMovimiento', label: 'Fecha Movimiento', type: 'date' },
    { name: 'tipoMovimiento', label: 'Tipo Movimiento', type: 'text' },
    { name: 'cantidad', label: 'Cantidad', type: 'number' },
    { name: 'detalle', label: 'Detalle', type: 'text' },
  ];

  return (
    <div className="page-container">
      <h1>Movimientos de Inventario</h1>
      <div className="action-buttons">
        <Button 
          className="agregar"
          onClick={() => {
            setModalTitle('Agregar Movimiento de Inventario');
            setSelectedMovimiento(null);
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
        <DataTable columns={columns} data={movimientos} />
      </div>
      <CustomModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        title={modalTitle} 
        handleSubmit={() => {
          if (selectedMovimiento) {
            handleUpdateMovimiento(selectedMovimiento.id, selectedMovimiento);
          } else {
            handleAddMovimiento(selectedMovimiento);
          }
        }}
      >
        <FormComponent 
          fields={fields} 
          initialValues={selectedMovimiento || {}} 
          onSubmit={(values) => {
            if (selectedMovimiento) {
              handleUpdateMovimiento(selectedMovimiento.id, values);
            } else {
              handleAddMovimiento(values);
            }
          }}
        />
      </CustomModal>
    </div>
  );
};

export default MovimientoInventario;
