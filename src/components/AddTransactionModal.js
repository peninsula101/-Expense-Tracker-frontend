import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../utils/apiURL'

const AddTransactionModal = ({ closeModal, refreshData, existingData }) => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (existingData) {
      setFormData({
        title: existingData.title,
        amount: existingData.amount,
        category: existingData.category,
        date: existingData.date.split('T')[0], 
        notes: existingData.notes || ''
      });
    }
  }, [existingData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existingData) {
        await axios.put(`${API_URL}/transactions/${existingData._id}`, formData, {
          headers: { "auth-token": token }
        });
      } else {
        await axios.post(`${API_URL}/transactions`, formData, {
          headers: { "auth-token": token }
        });
      }
      refreshData();
      closeModal();
    } catch (err) {
      console.error(err); 
      alert("Error saving transaction");
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {existingData ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input 
            name="title" placeholder="Title" required value={formData.title}
            className="w-full border p-2" onChange={handleChange} 
          />
          <input 
            name="amount" type="number" placeholder="Amount" required value={formData.amount}
            className="w-full border p-2" onChange={handleChange} 
          />
          <select 
            name="category" className="w-full border p-2" 
            onChange={handleChange} value={formData.category}
          >
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          <input 
            name="date" type="date" required value={formData.date}
            className="w-full border p-2" onChange={handleChange} 
          />
          <textarea 
            name="notes" placeholder="Notes" value={formData.notes}
            className="w-full border p-2" onChange={handleChange} 
          />
          
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {existingData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
