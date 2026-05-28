import React from 'react';
import '../../styles/CardForm.css';

export default function CardForm({ children, onSubmit }) {
  return (
    <div className="card-form-container">
      <form className="card-form-box" onSubmit={onSubmit}>
        <div className="card-form-grid">
          {children}
        </div>
      </form>
    </div>
  );
}