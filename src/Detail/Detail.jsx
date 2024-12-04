import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, get, set, update, remove } from "firebase/database";
import { app } from '../firebaseConf';
import {  uploadBytes, getDownloadURL,ref as storageRef } from "firebase/storage";
import { storage } from '../firebaseConf';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Detail.css';




export default function Details() {
  const { id } = useParams();
  const [etudiant, setEtudiant] = useState({});
  const [annee, setAnnee] = useState(null);
  const [fichier, setFichier] = useState(null);
  const [modify, setModify] = useState("");
  const modalRef = useRef(null);
  const modalEditRef = useRef(null);

  useEffect(() => {
    fetchEtudiant(id);
  }, [id]);

  const fetchEtudiant = async (etudiantId) => {
    const db = getDatabase(app);
    const dbRef = ref(db, `etudiants/${etudiantId}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setEtudiant(snapshot.val());
    } else {
      alert("Étudiant non trouvé");
    }
  };

  const handleAjouterNote = async () => {
    const db = getDatabase(app);
    const notesRef = ref(db, `etudiants/${id}/notes`);

    const newNote = {
      annee: annee ? annee.getFullYear() : null,
      fichier: null, // Initialiser le champ 'fichier' à null pour le moment
    };

    try {
      if (fichier) {
        const fileStorageRef = storageRef(storage, `etudiants/${id}/notes/${fichier.name}`);
        await uploadBytes(fileStorageRef, fichier);
        const fichierUrl = await getDownloadURL(fileStorageRef);
        newNote.fichier = fichierUrl;
      }

      if (modify) {
        await update(ref(db, `etudiants/${id}/notes/${modify}`), newNote);
        alert("Modification réussie");
      } else {
        await update(notesRef, { [new Date().getTime()]: newNote });
        alert("Note ajoutée avec succès");
      }

      setAnnee(null);
      setFichier(null);
      setModify(null);
      fetchEtudiant(id);
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note:", error);
      alert("Une erreur est survenue lors de l'ajout de la note.");
    }
  };

  const handleFileChange = (e) => {
    setFichier(e.target.files[0]);
  };

  const modifier = async (noteId) => {
    const db = getDatabase(app);
    const dbRef = ref(db, `etudiants/${id}/notes/${noteId}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setAnnee(new Date(snapshot.val().annee, 0, 1));
      setFichier(snapshot.val().fichier);
      setModify(noteId);
      openEditModal();
    } else {
      alert("Impossible de récupérer les données à modifier.");
    }
  };

  const deleteNotes = async (noteId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer  ?")) {
      const db = getDatabase(app);
      const dbRef = ref(db, `etudiants/${id}/notes/${noteId}`);
      await remove(dbRef);
      alert("Note supprimée avec succès");
      fetchEtudiant(id);
    }
  };

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.style.display = 'block';
    }
  };

  const openEditModal = () => {
    if (modalEditRef.current) {
      modalEditRef.current.style.display = 'block';
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.style.display = 'none';
    }
    if (modalEditRef.current) {
      modalEditRef.current.style.display = 'none';
    }
    setAnnee(null);
    setFichier(null);
    setModify(null);
  };

  return (
    <div className="hero-bg">
      <br />
      <br />
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <h1 className="h3 mb-2 ti font-weight-bold" >
            Ajouter vos notes {etudiant.etudiantNom} {etudiant.etudiantPrenom} {etudiant.etudiantFiliere}
          </h1>

          <button
            type="button"
            className="btn btn-success mb-3"
            data-toggle="modal"
            data-target="#exampleModal"
          >
            Ajouter une Note
          </button>

          {/* Modal pour ajouter une note */}
          <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document" id='add'>
              <div className="modal-content">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title" id="exampleModalLabel">Ajouter une Note</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="annee">Choisir l'année</label>
                      <DatePicker
                        selected={annee}
                        onChange={date => setAnnee(date)}
                        showYearPicker
                        dateFormat="yyyy"
                        className="form-control"
                        id="annee"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="file">Choisir un fichier</label>
                      <input type="file" id="file" className="form-control" onChange={handleFileChange} />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={handleAjouterNote} className="btn btn-primary">Ajouter</button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des notes */}
          <div className="card shadow mb-4">
            <div className="card-header py-3 bg-color text-white">
              <h6 className="m-0 font-weight-bold text-white">Listes des Notes</h6>
            </div>
            <div className="card-body">
              <DataTable data={etudiant.notes || {}} modifier={modifier} deleteNotes={deleteNotes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DataTable = ({ data, modifier, deleteNotes }) => (
  <div className="table-responsive">
    <table className="table table-striped table-bordered table-hover">
      <thead className="thead-dark">
        <tr>
          <th>Année</th>
          <th>Fichier</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([key, note]) => (
          <tr key={key}>
            <td>{note.annee}</td>
            <td>
              {note.fichier ? (
                <a href={note.fichier} target="_blank" rel="noopener noreferrer" className="btn btn-link btn-sm">
                  Télécharger
                </a>
              ) : (
                <span className="text-muted">Aucun fichier</span>
              )}
            </td>
            <td className="text-center">
              {/* <button
                className="btn btn-warning btn-sm mx-1"
                onClick={() => modifier(key)}
              >
                <i className="fas fa-edit"></i> Modifier
              </button> */}
              <button
                className="btn btn-danger btn-sm mx-1"
                onClick={() => deleteNotes(key)}
              >
                <i className="fas fa-trash-alt"></i> Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {Object.keys(data).length === 0 && (
      <div className="text-center text-muted my-3">
        <p>Aucune note disponible.</p>
      </div>
    )}
  </div>
);
