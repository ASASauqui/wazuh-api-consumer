import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Agent from "./pages/Agent";
import Users from "./pages/Users";
import AllVulnerabilities from "./pages/AllVulnerabilities";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { AlreadyAuthenticatedRoute } from "./components/AlreadyAuthenticatedRoute";
import { AuthProvider } from "./hooks/useAuth";
import Decoders from "./pages/Decoders";
import Rules from "./pages/Rules";

function App() {
  return (
    <div className="min-w-[350px]">
      {/* Toast Container */}
      <ToastContainer />

      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={
              <AlreadyAuthenticatedRoute>
                <Login />
              </AlreadyAuthenticatedRoute>} />
            <Route path="/" element={
              <ProtectedRoute>
                <Navbar />
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/decoders" element={
              <ProtectedRoute>
                <Navbar />
                <Decoders />
              </ProtectedRoute>
            } />
            <Route path="/rules" element={
              <ProtectedRoute>
                <Navbar />
                <Rules />
              </ProtectedRoute>
            } />
            <Route path="/agent/:id" element={
              <ProtectedRoute>
                <Navbar />
                <Agent />
              </ProtectedRoute>} />
            <Route path="/users" element={
              <ProtectedRoute>
                <Navbar />
                <Users />
              </ProtectedRoute>} />
            <Route path="/all_vulnerabilities" element={
              <ProtectedRoute>
                <Navbar />
                <AllVulnerabilities />
              </ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
