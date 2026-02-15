import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../utils/apiURL';
import AddTransactionModal from '../components/AddTransactionModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const TransactionExplorer = () => {
  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [editing, setEditing] = useState(null);

  const fetchT = useCallback(async (reset = false) => {
    try {
      const p = reset ? 1 : page;
      const res = await axios.get(`${API_URL}/transactions`, {
        headers: { "auth-token": token },
        params: { page: p, limit: 10, search, category }
      });
      setTransactions(reset ? res.data.transactions : [...transactions, ...res.data.transactions]);
    } catch (err) { console.error(err); }
  }, [token, page, search, category, transactions]); 

  useEffect(() => { setPage(1); fetchT(true); }, [search, category, fetchT]);
  useEffect(() => { if (page > 1) fetchT(); }, [page, fetchT]);

  const del = async (id) => {
    if (window.confirm("Delete?")) {
      await axios.delete(`${API_URL}/transactions/${id}`, { headers: { "auth-token": token } });
      setTransactions(transactions.filter(t => t._id !== id));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Expense Tracker Report", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableColumn = ["Date", "Title", "Category", "Amount", "Type"];
    const tableRows = [];

    transactions.forEach(t => {
      const transactionData = [
        new Date(t.date).toLocaleDateString(),
        t.title,
        t.category,
        `Rs. ${t.amount.toLocaleString('en-IN')}`, 
        t.category === 'Income' ? 'Credit' : 'Debit'
      ];
      tableRows.push(transactionData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246] } 
    });

    doc.save("bellcorp_report.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Explorer</h1>
          <p className="text-slate-500">Manage your transactions</p>
        </div>
        
        <button 
          onClick={generatePDF} 
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-700 transition flex items-center gap-2"
        >
          <span>Download Report</span>
        </button>
      </div>

      <div className="flex gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <input type="text" placeholder="Search..." className="flex-1 p-2 outline-none font-medium text-slate-700" onChange={(e) => setSearch(e.target.value)} />
        <div className="w-px bg-slate-200"></div>
        <select className="p-2 outline-none font-medium text-slate-700 bg-transparent" onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
        </select>
      </div>

      <div className="space-y-4">
        {transactions.map(t => (
          <div key={t._id} className="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center border border-slate-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${t.category === 'Income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {t.category[0]}
              </div>
              <div>
                <p className="font-bold text-lg text-slate-800">{t.title}</p>
                <p className="text-sm text-slate-400 font-medium">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className={`text-xl font-black ${t.category === 'Income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {t.category === 'Income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setEditing(t)} className="text-blue-500 font-bold hover:bg-blue-50 px-3 py-1 rounded-lg transition">Edit</button>
                <button onClick={() => del(t._id)} className="text-rose-500 font-bold hover:bg-rose-50 px-3 py-1 rounded-lg transition">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {transactions.length === 0 && <p className="text-center text-slate-400 py-10">No transactions found.</p>}
      </div>

      <button onClick={() => setPage(p => p + 1)} className="mt-8 w-full p-4 bg-white rounded-2xl font-bold text-slate-500 shadow-sm border border-slate-100 hover:bg-slate-50 transition">Load More Transactions</button>
      
      {editing && <AddTransactionModal existingData={editing} closeModal={() => setEditing(null)} refreshData={() => { setPage(1); fetchT(true); }} />}
    </div>
  );
};
export default TransactionExplorer;
