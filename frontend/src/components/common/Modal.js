// src/components/common/CustomModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../styles/modalStyle.css'; // Importar la hoja de estilos para el modal

const CustomModal = ({ show, handleClose, title, children, handleSubmit }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className="modal-button">
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
