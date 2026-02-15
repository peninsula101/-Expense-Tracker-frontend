import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./dashboard/Dashboard";
import TransactionExplorer from "./explorer/TransactionExplorer";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          
          <main className="flex-1 ml-0 lg:ml-64 p-8 transition-all duration-300">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/explorer" element={
                <ProtectedRoute><TransactionExplorer /></ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;