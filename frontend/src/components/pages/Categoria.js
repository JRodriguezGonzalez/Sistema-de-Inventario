// src/components/pages/Categoria.js
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

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getData('Categoria/Categoria.php')
      .then((response) => {
        setCategorias(response.data);
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
      getData(`Categoria/Categoria.php?id=${searchId}`)
        .then((response) => {
          setCategorias([response.data]);
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

  const handleAddCategoria = (newCategoria) => {
    const categoriaConEstado = { ...newCategoria, estado: 'activo' };
    createData('Categoria/Categoria.php', categoriaConEstado)
      .then(() => {
        fetchData();
        setShowModal(false);
        setError(null);
        Swal.fire('Éxito', 'Categoría agregada con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al crear datos:', error);
        setError('Error creating data. Please try again later.');
        Swal.fire('Error', 'No se pudo agregar la categoría', 'error');
      });
  };

  const handleUpdateCategoria = (id, updatedCategoria) => {
    updateData('Categoria/Categoria.php', id, updatedCategoria)
      .then(() => {
        fetchData();
        setShowModal(false);
        setError(null);
        Swal.fire('Éxito', 'Categoría actualizada con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al actualizar datos:', error);
        setError('Error updating data. Please try again later.');
        Swal.fire('Error', 'No se pudo actualizar la categoría', 'error');
      });
  };

  const handleDeleteCategoria = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres desactivar esta categoría?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData('Categoria/Categoria.php', id)
          .then(() => {
            fetchData();
            setError(null);
            Swal.fire('Desactivado!', 'Categoría desactivada con éxito', 'success');
          })
          .catch((error) => {
            console.error('Error al eliminar datos:', error);
            setError('Error eliminando datos. Por favor, inténtelo de nuevo más tarde.');
            Swal.fire('Error', 'No se pudo desactivar la categoría', 'error');
          });
      }
    });
  };

  const handleActivateCategoria = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres activar esta categoría?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar!'
    }).then((result) => {
      if (result.isConfirmed) {
        patchData('Categoria/Categoria.php', id, { id }) // Pasar el id en el cuerpo de la solicitud
          .then(() => {
            fetchData();
            setError(null);
            Swal.fire('Activado!', 'Categoría activada con éxito', 'success');
          })
          .catch((error) => {
            console.error('Error al activar datos:', error);
            setError('Error activando datos. Por favor, inténtelo de nuevo más tarde.');
            Swal.fire('Error', 'No se pudo activar la categoría', 'error');
          });
      }
    });
  };

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Nombre', accessor: 'nombre' },
    { Header: 'Descripción', accessor: 'descripcion' },
    { Header: 'Estado', accessor: 'estado' },
    { 
      Header: 'Acciones', 
      accessor: 'acciones', 
      Cell: ({ row }) => (
        <div>
          <Button 
            className="editar" 
            onClick={() => {
              setModalTitle('Editar Categoría');
              setSelectedCategoria(row.original);
              setShowModal(true);
            }}
            style={{ marginRight: '5px' }}
          >
            <FaEdit /> Editar
          </Button>
          {['activo', 'activa'].includes(row.original.estado.toLowerCase()) ? (
            <Button 
              className="eliminar"
              onClick={() => handleDeleteCategoria(row.original.id)} 
              style={{ marginRight: '5px' }}
            >
              <FaTrash /> Eliminar
            </Button>
          ) : (
            <Button 
              className="activar"
              onClick={() => handleActivateCategoria(row.original.id)} 
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
  ];

  return (
    <div className="page-container">
      <h1>Categorías</h1>
      <div className="action-buttons">
        <Button 
          className="agregar"
          onClick={() => {
            setModalTitle('Agregar Categoría');
            setSelectedCategoria(null);
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
        <DataTable columns={columns} data={categorias} />
      </div>
      <CustomModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        title={modalTitle} 
        handleSubmit={() => {
          if (selectedCategoria) {
            handleUpdateCategoria(selectedCategoria.id, selectedCategoria);
          } else {
            handleAddCategoria(selectedCategoria);
          }
        }}
      >
        <FormComponent 
          fields={fields} 
          initialValues={selectedCategoria || {}} 
          onSubmit={(values) => {
            if (selectedCategoria) {
              handleUpdateCategoria(selectedCategoria.id, values);
            } else {
              handleAddCategoria(values);
            }
          }}
        />
      </CustomModal>
    </div>
  );
};

export default Categoria;
