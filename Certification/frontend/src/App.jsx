import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CertificatePage from "./components/CertificatePage";
import Certy from "./components/Certy";
import CertificateView from "./components/CertificateView";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Certy/>} />
                <Route path="/certificates" element={<CertificatePage />} />
                <Route path="/certificate/view/:id" element={<CertificateView />} />
            </Routes>
        </Router>
    );
};

export default App;
