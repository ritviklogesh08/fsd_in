import { useEffect, useState } from 'react';
import api from '../../api/axios';

const UserDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const docs = await api.get('/documents');
      const reqs = await api.get('/requests');
      setDocuments(docs.data);
      setRequests(reqs.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to load data');
    }
  };

  useEffect(() => { loadData(); }, []);

  const getStatus = (docId) => {
    const request = requests.find((req) => req.documentId._id === docId);
    return request ? request.status : 'NOT REQUESTED';
  };

  const handleRequest = async (documentId) => {
    setMessage('');
    try {
      await api.post('/requests', { documentId });
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Request submission failed');
    }
  };

  const handleDownload = async (documentId, title) => {
    try {
      const response = await api.get(`/documents/${documentId}/download`, { responseType: 'blob' });
      const href = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Download failed');
    }
  };

  return (
    <div className="dashboard-card">
      <h2>User Dashboard</h2>
      {message && <p className="error">{message}</p>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => {
            const status = getStatus(doc._id);
            return (
              <tr key={doc._id}>
                <td>{doc.title}</td>
                <td>{doc.description}</td>
                <td>{status}</td>
                <td>
                  {status === 'APPROVED' ? (
                    <button onClick={() => handleDownload(doc._id, doc.title)}>Download</button>
                  ) : (
                    <button onClick={() => handleRequest(doc._id)} disabled={status !== 'NOT REQUESTED'}>
                      Request Access
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
