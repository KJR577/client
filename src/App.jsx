import React, { useState } from 'react';
import './App.css';

// Dynamically use environment variable or fallback to local/render backend URL
// Replace 'https://YOUR-EXPRESS-BACKEND.onrender.com' with your actual Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://client-z605.onrender.com/api/users';

function App() {
  const [formData, setFormData] = useState({ name: '', dno: '' });
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      // Sends request directly to your Express backend service
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage({ 
          type: 'success', 
          text: result.message || 'User details saved successfully!' 
        });
        setFormData({ name: '', dno: '' }); // Reset form input fields
      } else {
        setStatusMessage({ 
          type: 'error', 
          text: result.error || 'Failed to submit user details.' 
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      setStatusMessage({ 
        type: 'error', 
        text: 'Failed to connect to the server. Please verify your backend service is online.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>User Registration Form</h2>

        {statusMessage.text && (
          <div className={`alert ${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dno">Door Number (D.No)</label>
            <input
              type="text"
              id="dno"
              name="dno"
              placeholder="Enter door number"
              value={formData.dno}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Saving to Database...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;