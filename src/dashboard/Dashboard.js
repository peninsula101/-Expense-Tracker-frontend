import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../utils/apiURL';
import AddTransactionModal from '../components/AddTransactionModal';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [summary, setSummary] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [recent, setRecent] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const sRes = await axios.get(`${API_URL}/transactions/summary`, { headers: { "auth-token": token } });
      setSummary(sRes.data);
      const rRes = await axios.get(`${API_URL}/transactions`, { headers: { "auth-token": token }, params: { limit: 5 } });
      setRecent(rRes.data.transactions);
    } catch (err) { console.error(err); }
  }, [token]);

  useEffect(() => { if (token) fetchData(); }, [fetchData, token]);

  const total = summary.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-slate-900">Dashboard</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">+ Add</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Expenses</p>
          <h2 className="text-3xl font-black mt-2">₹{total.toLocaleString('en-IN')}</h2>
        </div>
        <div className="bg-blue-600 p-8 rounded-3xl shadow-lg">
          <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Categories</p>
          <h2 className="text-3xl font-black text-white mt-2">{summary.length}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="text-xl font-bold self-start mb-6">Category Breakdown</h3>
          <div className="h-64 w-64">
            <Pie data={{
              labels: summary.map(s => s._id),
              datasets: [{ data: summary.map(s => s.totalAmount), backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'], borderWidth: 0 }]
            }} options={{ cutout: '70%', plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recent.map(t => (
              <div key={t._id} className="flex justify-between items-center">
                <span className="font-semibold">{t.title}</span>
                <span className="font-bold text-slate-900">₹{t.amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && <AddTransactionModal closeModal={() => setShowModal(false)} refreshData={fetchData} />}
    </div>
  );
};
export default Dashboard;