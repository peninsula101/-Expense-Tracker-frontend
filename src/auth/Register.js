import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../utils/apiURL";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register`, { username, password });
      navigate("/login");
    } catch (err) { alert("Registration failed"); }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-black text-center mb-8 tracking-tight">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Choose Username" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Choose Password" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">Register</button>
        </form>
        <p className="mt-6 text-center text-slate-500">Have an account? <Link to="/login" className="text-emerald-600 font-bold">Login</Link></p>
      </div>
    </div>
  );
};
export default Register;