import React, { useState } from 'react';
import { adminAPI } from '../../utils/api';
const EditStoreModal = ({ isOpen, onClose, store, onStoreUpdated }) => {
  const [form, setForm] = useState({
    name: store?.name || '',
    email: store?.email || '',
    address: store?.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form when store changes
  React.useEffect(() => {
    setForm({
      name: store?.name || '',
      email: store?.email || '',
      address: store?.address || '',
    });
  }, [store]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminAPI.updateStore(store.id, form);
      onStoreUpdated();
      onClose();
    } catch (err) {
      setError('Failed to update store: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="text-2xl">&times;</span>
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Store</h2>
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Store'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStoreModal;
