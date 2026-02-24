import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import PatientForm from "./PatientForm";
import LoginPage from "./LoginPage";
import MapView from "./MapView";
import DashboardHospital from "./hospitaldashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<PatientForm />} />
        <Route path="/hdash" element={<DashboardHospital />} />
        <Route path="/map" element={<MapView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
