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

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getData('Usuario/usuario.php')
      .then((response) => {
        setUsuarios(response.data);
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
      getData(`Usuario/usuario.php?id=${searchId}`)
        .then((response) => {
          setUsuarios([response.data]);
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

  const handleAddUsuario = (newUsuario) => {
    const usuarioConEstado = { ...newUsuario, estado: 'activo' };
    createData('Usuario/usuario.php', usuarioConEstado)
      .then(() => {
        fetchData();
        setShowModal(false);
        setError(null);
        Swal.fire('Éxito', 'Usuario agregado con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al crear datos:', error);
        setError('Error creating data. Please try again later.');
        Swal.fire('Error', 'No se pudo agregar el usuario', 'error');
      });
  };

  const handleUpdateUsuario = (id, updatedUsuario) => {
    updateData('Usuario/usuario.php', id, updatedUsuario)
      .then(() => {
        fetchData();
        setShowModal(false);
        setError(null);
        Swal.fire('Éxito', 'Usuario actualizado con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al actualizar datos:', error);
        setError('Error updating data. Please try again later.');
        Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
      });
  };

  const handleDeleteUsuario = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres desactivar este usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData('Usuario/usuario.php', id)
          .then(() => {
            fetchData();
            setError(null);
            Swal.fire('Desactivado!', 'Usuario desactivado con éxito', 'success');
          })
          .catch((error) => {
            console.error('Error al eliminar datos:', error);
            setError('Error eliminando datos. Por favor, inténtelo de nuevo más tarde.');
            Swal.fire('Error', 'No se pudo desactivar el usuario', 'error');
          });
      }
    });
  };

  const handleActivateUsuario = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres activar este usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar!'
    }).then((result) => {
      if (result.isConfirmed) {
        patchData('Usuario/usuario.php', id)
          .then(() => {
            fetchData();
            setError(null);
            Swal.fire('Activado!', 'Usuario activado con éxito', 'success');
          })
          .catch((error) => {
            console.error('Error al activar datos:', error);
            setError('Error activando datos. Por favor, inténtelo de nuevo más tarde.');
            Swal.fire('Error', 'No se pudo activar el usuario', 'error');
          });
      }
    });
  };

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Nombre', accessor: 'nombre' },
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
              setModalTitle('Editar Usuario');
              setSelectedUsuario(row.original);
              setShowModal(true);
            }}
            style={{ marginRight: '5px' }}
          >
            <FaEdit /> Editar
          </Button>
          {row.original.estado === 'activo' ? (
            <Button 
              className="eliminar"
              onClick={() => handleDeleteUsuario(row.original.id)} 
              style={{ marginRight: '5px' }}
            >
              <FaTrash /> Eliminar
            </Button>
          ) : (
            <Button 
              className="activar"
              onClick={() => handleActivateUsuario(row.original.id)} 
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
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
  ];

  return (
    <div className="page-container">
      <h1>Usuarios</h1>
      <div className="action-buttons">
        <Button 
          className="agregar"
          onClick={() => {
            setModalTitle('Agregar Usuario');
            setSelectedUsuario(null);
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
        <DataTable columns={columns} data={usuarios} />
      </div>
      <CustomModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        title={modalTitle} 
        handleSubmit={() => {
          if (selectedUsuario) {
            handleUpdateUsuario(selectedUsuario.id, selectedUsuario);
          } else {
            handleAddUsuario(selectedUsuario);
          }
        }}
      >
        <FormComponent 
          fields={fields} 
          initialValues={selectedUsuario || {}} 
          onSubmit={(values) => {
            if (selectedUsuario) {
              handleUpdateUsuario(selectedUsuario.id, values);
            } else {
              handleAddUsuario(values);
            }
          }}
        />
      </CustomModal>
    </div>
  );
};

export default Usuario;
