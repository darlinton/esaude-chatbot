import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminApiKeyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState([]);
  const [editingApiKey, setEditingApiKey] = useState(null); // Stores the API key being edited
  const [newKeyValue, setNewKeyValue] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login'); // Redirect non-admins
    } else {
      fetchApiKeys();
    }
  }, [user, navigate]);

  const fetchApiKeys = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await API.get('/admin/api-keys', config);
      setApiKeys(response.data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      alert('Failed to fetch API keys.');
    }
  };

  const handleEditClick = (apiKeyEntry) => {
    setEditingApiKey(apiKeyEntry);
    setNewKeyValue(''); // Clear previous value when opening edit form
  };

  const updateApiKey = async (e) => {
    e.preventDefault();
    if (!editingApiKey || !newKeyValue) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await API.put(`/admin/api-keys/${editingApiKey.botType}`, { apiKey: newKeyValue }, config);
      setEditingApiKey(null);
      setNewKeyValue('');
      fetchApiKeys();
      alert(`${editingApiKey.botType} API key updated successfully!`);
    } catch (error) {
      console.error('Error updating API key:', error);
      alert('Failed to update API key.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin API Key Management</h1>

      {/* List Existing API Keys */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">API Keys</h2>
        {apiKeys.length === 0 ? (
          <p>No API keys found. Please add them.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Bot Type</th>
                  <th className="py-2 px-4 border-b">API Key (Masked)</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key._id}>
                    <td className="py-2 px-4 border-b">{key.botType}</td>
                    <td className="py-2 px-4 border-b">{key.apiKey}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleEditClick(key)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit API Key Modal/Form */}
      {editingApiKey && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-semibold mb-4">Edit API Key for {editingApiKey.botType}</h2>
            <form onSubmit={updateApiKey}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newKeyValue">
                  New API Key:
                </label>
                <input
                  type="text"
                  name="newKeyValue"
                  id="newKeyValue"
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingApiKey(null)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApiKeyPage;
