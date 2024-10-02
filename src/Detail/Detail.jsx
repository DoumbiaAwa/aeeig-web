import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, get} from "firebase/database";
import { app } from '../firebaseConf';

export default function Details() {
  const { id } = useParams();
  const [etudiant, setEtudiant] = useState({});

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


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ marginTop: '-45%', width: '80%', marginLeft: '15%' }}>
        <h3>{etudiant.etudiantNom} {etudiant.etudiantPrenom} {etudiant.etudiantFiliere}</h3>

        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Listes des Notes</h6>
          </div>
          <div className="card-body">
            <DataTable />
          </div>
        </div>
      </div>
    </div>
  );
}

const DataTable = ({ data }) => {
    console.log("DataTable data:", data);  // Ajoutez ceci pour vérifier le format des données
  
    if (typeof data !== 'object' || data === null || Object.keys(data).length === 0) {
      return <p>Aucune donnée disponible</p>;
    }
  
    return (
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Année</th>
              <th>Fichier</th>
              <th>Téléchargement</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, note]) => (
              <tr key={key}>
                <td>{note.annee || 'N/A'}</td>
                <td>{note.fichier || 'N/A'}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
