// src/components/common/FormComponent.js
import React from 'react';
import { useFormik } from 'formik';
import '../../styles/formStyle.css'; // Importar la hoja de estilos para el formulario

const FormComponent = ({ fields, initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="custom-form">
      {fields.map((field) => (
        <div key={field.name} className="form-group">
          <label className="form-label">{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            onChange={formik.handleChange}
            value={formik.values[field.name] || ''}
            className="form-control"
          />
        </div>
      ))}
      <button type="submit" className="btn custom-btn">Realizar</button>
    </form>
  );
};

export default FormComponent;
