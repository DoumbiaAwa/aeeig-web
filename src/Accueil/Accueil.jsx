import React, { useState } from 'react';
import './Accueil.css';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'; // Assurez-vous que React Router est installé

export default function Accueil() {
  const [show, setShow] = useState(false);
  const [studentId, setStudentId] = useState(''); // État pour capturer l'ID
  const navigate = useNavigate(); // Hook pour rediriger

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleValidate = () => {
    if (studentId.trim() === '') {
      alert("Veuillez entrer un ID valide."); // Vérifiez si l'ID est vide
      return;
    }

    // Redirection vers la page de l'étudiant avec l'ID
    navigate(`/detail/${studentId}`);
  };

  return (
    <div style={{ height: '100%' }}>
      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Entrer l'ID fourni par l'administrateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="studentIdInput">
              <Form.Control
                type="text"
                placeholder="ID"
                value={studentId} // Lier l'input à l'état
                onChange={(e) => setStudentId(e.target.value)} // Mettre à jour l'état
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleValidate}>
            Valider
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Hero Section */}
      <div className="hero-area hero-bg" style={{ height: '100%' }}>
        <div className="container" style={{ height: '100%' }}>
          <div className="row">
            <div className="col-lg-9 offset-lg-2 text-center">
              <div className="hero-text">
                <div className="hero-text-tablecell">
                  <p className="subtitle">Numero</p>
                  <h1 style={{ fontSize: '40px' }}>Association des Étudiants Ivoiriens en Guinée</h1>
                  <div className="hero-btns">
                    <button className="boxed-btn" onClick={handleShow}>
                      <a>Commencer</a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
