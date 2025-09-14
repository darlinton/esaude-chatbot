import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPromptPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState({
    promptName: '',
    botType: 'openai', // Default to openai
    promptContent: '',
    isDefault: false,
  });
  const [editingPrompt, setEditingPrompt] = useState(null); // Stores the prompt being edited

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login'); // Redirect non-admins
    } else {
      fetchPrompts();
    }
  }, [user, navigate]);

  const fetchPrompts = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await API.get('/admin/prompts', config);
      setPrompts(response.data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      alert('Failed to fetch prompts.');
    }
  };

  const handleNewPromptChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPrompt((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditPromptChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingPrompt((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const createPrompt = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await API.post('/admin/prompts', newPrompt, config);
      setNewPrompt({
        promptName: '',
        botType: 'openai',
        promptContent: '',
        isDefault: false,
      });
      fetchPrompts();
      alert('Prompt created successfully!');
    } catch (error) {
      console.error('Error creating prompt:', error);
      alert('Failed to create prompt.');
    }
  };

  const updatePrompt = async (e) => {
    e.preventDefault();
    if (!editingPrompt) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await API.put(`/admin/prompts/${editingPrompt._id}`, editingPrompt, config);
      setEditingPrompt(null);
      fetchPrompts();
      alert('Prompt updated successfully!');
    } catch (error) {
      console.error('Error updating prompt:', error);
      alert('Failed to update prompt.');
    }
  };

  const deletePrompt = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await API.delete(`/admin/prompts/${id}`, config);
      fetchPrompts();
      alert('Prompt deleted successfully!');
    } catch (error) {
      console.error('Error deleting prompt:', error);
      alert('Failed to delete prompt.');
    }
  };

  const setDefaultPrompt = async (id) => {
    if (!window.confirm('Are you sure you want to set this prompt as default?')) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await API.put(`/admin/prompts/${id}/set-default`, {}, config);
      fetchPrompts();
      alert('Default prompt set successfully!');
    } catch (error) {
      console.error('Error setting default prompt:', error);
      alert('Failed to set default prompt.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Prompt Management</h1>

      {/* Create New Prompt Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Prompt</h2>
        <form onSubmit={createPrompt}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="promptName">
              Prompt Name:
            </label>
            <input
              type="text"
              name="promptName"
              id="promptName"
              value={newPrompt.promptName}
              onChange={handleNewPromptChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="botType">
              Bot Type:
            </label>
            <select
              name="botType"
              id="botType"
              value={newPrompt.botType}
              onChange={handleNewPromptChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="promptContent">
              Prompt Content:
            </label>
            <textarea
              name="promptContent"
              id="promptContent"
              value={newPrompt.promptContent}
              onChange={handleNewPromptChange}
              rows="10"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={newPrompt.isDefault}
              onChange={handleNewPromptChange}
              className="mr-2 leading-tight"
            />
            <label className="text-sm" htmlFor="isDefault">
              Set as Default for this Bot Type
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Prompt
          </button>
        </form>
      </div>

      {/* List Existing Prompts */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Prompts</h2>
        {prompts.length === 0 ? (
          <p>No prompts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Bot Type</th>
                  <th className="py-2 px-4 border-b">Default</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prompts.map((prompt) => (
                  <tr key={prompt._id}>
                    <td className="py-2 px-4 border-b">{prompt.promptName}</td>
                    <td className="py-2 px-4 border-b">{prompt.botType}</td>
                    <td className="py-2 px-4 border-b">{prompt.isDefault ? 'Yes' : 'No'}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => setEditingPrompt({ ...prompt })}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePrompt(prompt._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs mr-2"
                      >
                        Delete
                      </button>
                      {!prompt.isDefault && (
                        <button
                          onClick={() => setDefaultPrompt(prompt._id)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs"
                        >
                          Set Default
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Prompt Modal/Form */}
      {editingPrompt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-semibold mb-4">Edit Prompt</h2>
            <form onSubmit={updatePrompt}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editPromptName">
                  Prompt Name:
                </label>
                <input
                  type="text"
                  name="promptName"
                  id="editPromptName"
                  value={editingPrompt.promptName}
                  onChange={handleEditPromptChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editBotType">
                  Bot Type:
                </label>
                <select
                  name="botType"
                  id="editBotType"
                  value={editingPrompt.botType}
                  onChange={handleEditPromptChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  disabled // Bot type should not be changeable after creation
                >
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Gemini</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editPromptContent">
                  Prompt Content:
                </label>
                <textarea
                  name="promptContent"
                  id="editPromptContent"
                  value={editingPrompt.promptContent}
                  onChange={handleEditPromptChange}
                  rows="10"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                ></textarea>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  id="editIsDefault"
                  checked={editingPrompt.isDefault}
                  onChange={handleEditPromptChange}
                  className="mr-2 leading-tight"
                />
                <label className="text-sm" htmlFor="editIsDefault">
                  Set as Default for this Bot Type
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingPrompt(null)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromptPage;
