const AccessRequest = require('../models/AccessRequest');
const Document = require('../models/Document');

exports.createRequest = async (req, res) => {
  const { documentId } = req.body;
  try {
    const document = await Document.findById(documentId);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const existing = await AccessRequest.findOne({ userId: req.user._id, documentId });
    if (existing) return res.status(400).json({ message: 'Request already exists' });

    const request = await AccessRequest.create({ userId: req.user._id, documentId });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Request creation failed', error: error.message });
  }
};

exports.listRequests = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'USER') query.userId = req.user._id;

    const requests = await AccessRequest.find(query)
      .populate('userId', 'name email')
      .populate('documentId', 'title description');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Unable to list requests', error: error.message });
  }
};

exports.approveRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await AccessRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Access request not found' });

    request.status = 'APPROVED';
    request.updatedAt = Date.now();
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Approval failed', error: error.message });
  }
};

exports.rejectRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await AccessRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Access request not found' });

    request.status = 'REJECTED';
    request.updatedAt = Date.now();
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Rejection failed', error: error.message });
  }
};
