import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainApp } from "@/components/MainApp";
import { Home } from "@/components/Home";  // ⬅️ import Home
import { Header } from "@/components/Header";


function App() {
  return (
    
    <Router>
      
      <div className="min-h-screen bg-gray-50">
         <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/summarizer" element={<MainApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
