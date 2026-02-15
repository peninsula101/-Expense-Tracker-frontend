import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../utils/apiURL";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-black text-center mb-8 tracking-tight">Login</h2>
        {error && <p className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-center text-sm font-bold">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Username" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">Sign In</button>
        </form>
        <p className="mt-6 text-center text-slate-500">New here? <Link to="/register" className="text-blue-600 font-bold">Create account</Link></p>
      </div>
    </div>
  );
};
export default Login;