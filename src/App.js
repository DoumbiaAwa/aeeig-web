import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './Home/Home'
import Detail from './Detail/Detail';
function App() {
  return (
    <Router>
       <Routes>

       <Route path="/" element={
       <>
    <Home />
    </>
} />

<Route path="/detail/:id" element={
       <>
    <Detail />
    </>
} />
       

       </Routes>
    </Router>
  );
}

export default App;
