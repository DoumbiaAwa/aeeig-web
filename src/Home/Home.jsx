import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebaseConf';
import './Home.css'
export default function Home() {
    const [etudiant, setEtudiants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filieres, setFilieres] = useState([]); // Pour
    const [selectedFiliere, setSelectedFiliere] = useState(''); // Pour filtrer par filière
    const [item, setItem] = useState("")
    // Récupérer les filières
  const fetchFiliere = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, 'filieres');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setFilieres(Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value })));
    } else {
      alert('Aucune filière trouvée');
    }
  };

  // Récupérer les étudiants
  const fetchEtudiant = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, 'etudiants');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setEtudiants(Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value })));
    } else {
      alert('Aucun étudiant trouvé');
    }
  };

  
  useEffect(() => {
    fetchFiliere(); // Appel pour récupérer les filières
    fetchEtudiant(); // Appel pour récupérer les étudiants
  }, []);

// Fonction pour filtrer les étudiants par nom et par filière
// Fonction pour filtrer les étudiants par nom et par filière
const DataTable = () => {
    const filteredEtudiant = etudiant.filter((item) => {
      const matchesName = item.etudiantNom.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFiliere = selectedFiliere === '' || item.etudiantFiliere === selectedFiliere;
      return matchesName && matchesFiliere;
    });
  
    return (
      <ul className="list-group">
        {filteredEtudiant.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            {item.etudiantPrenom} {item.etudiantNom}
            <Link to={`/detail/${item.id}`} style={{ textDecoration: 'none', color: '#11a40a' }}>
              Voir <i className="fas fa-eye"></i>
            </Link>
          </li>
        ))}
      </ul>
    );
  };
  
  return (
<div> 
  <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dar">
    <img className="mr-3" src={require('./img/aeeig logo-1.png')} alt="" width="48" height="48"/>
    <a className="navbar-brand" href="#">Association des Étudiants Ivoiriens en Guinée</a>

    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul className="navbar-nav mr-auto"></ul>
      <form className="form-inline my-2 my-lg-0">
        <input className="form-control mr-sm-2" type="text" placeholder="Rechercher" aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} />
        <select className="form-control mr-sm-2" 
          value={selectedFiliere}
          onChange={(e) => setSelectedFiliere(e.target.value)}>
          <option value="">Toutes les filières</option>
          {filieres.map((filiere) => (
            <option key={filiere.id} value={filiere.filiereNom}>
              {filiere.filiereNom}
            </option>
          ))}
        </select>
      </form>
    </div>
  </nav>

  <main role="main" className="container">
    <div className="d-flex align-items-center p-3 my-3 text-white-50 bg-org rounded box-shadow">
      <img className="mr-3" src={require('./img/aeeig logo-1.png')} alt="" width="48" height="48"/>
      <div className="lh-100">
        <h6 className="mb-0 text-red lh-100">Rechercher votre Nom en filtrant par filiere</h6>
      </div>
    </div>

    <div className="my-3 p-3 bg-white rounded box-shadow">
      <h6 className="border-bottom border-gray pb-2 mb-0">Listes des étudiants</h6>
      <DataTable />
    </div>
  </main>
</div>

  )
}
