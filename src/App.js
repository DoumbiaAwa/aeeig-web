import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Accueil from './Accueil/Accueil';
import Detail from './Detail/Detail'
function App() {
  return (
    <Router>
       <Routes>

       <Route path="/" element={
       <>
    <Accueil />
    </>
} />

<Route path="/detail/:id" element={
       <>
      
    <Detail/>
    </>
} />

    

       </Routes>
    </Router>
  );
}

export default App;
