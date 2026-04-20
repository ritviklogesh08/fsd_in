import { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', file: null });
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const docs = await api.get('/documents');
      const reqs = await api.get('/requests');
      setDocuments(docs.data);
      setRequests(reqs.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to load admin data');
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);
      data.append('file', form.file);
      await api.post('/documents', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ title: '', description: '', file: null });
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    }
  };

  const updateRequest = async (requestId, action) => {
    setMessage('');
    try {
      await api.patch(`/requests/${requestId}/${action}`);
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    setMessage('');
    try {
      await api.delete(`/documents/${documentId}`);
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="dashboard-card">
      <h2>Admin Dashboard</h2>
      {message && <p className="error">{message}</p>}
      <section className="admin-section">
        <h3>Upload Document</h3>
        <form onSubmit={handleUpload}>
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} />
          <label>File</label>
          <input type="file" name="file" onChange={handleChange} accept=".pdf,.doc,.docx" required />
          <button type="submit">Upload</button>
        </form>
      </section>
      <section className="admin-section">
        <h3>Access Requests</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Document</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.userId?.name || 'Unknown'}</td>
                <td>{req.documentId?.title || 'Unknown'}</td>
                <td>{req.status}</td>
                <td>
                  <button onClick={() => updateRequest(req._id, 'approve')} disabled={req.status !== 'PENDING'}>
                    Approve
                  </button>
                  <button onClick={() => updateRequest(req._id, 'reject')} disabled={req.status !== 'PENDING'}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="admin-section">
        <h3>Uploaded Documents</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Uploaded By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.title}</td>
                <td>{doc.description}</td>
                <td>{doc.uploadedBy?.name || 'Unknown'}</td>
                <td>
                  <button onClick={() => handleDeleteDocument(doc._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
