const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const AccessRequest = require('../models/AccessRequest');

exports.uploadDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Document file is required' });

  const { title, description } = req.body;
  try {
    const document = await Document.create({
      title,
      description,
      filePath: req.file.path,
      uploadedBy: req.user._id,
    });
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

exports.listDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate('uploadedBy', 'name email');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Unable to list documents', error: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const document = await Document.findById(id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    document.title = title || document.title;
    document.description = description || document.description;
    await document.save();
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  const { id } = req.params;
  try {
    const document = await Document.findById(id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }
    await document.deleteOne();
    await AccessRequest.deleteMany({ documentId: document._id });
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

exports.downloadDocument = async (req, res) => {
  const { id } = req.params;
  try {
    const document = await Document.findById(id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const request = await AccessRequest.findOne({
      userId: req.user._id,
      documentId: document._id,
      status: 'APPROVED',
    });

    if (!request) return res.status(403).json({ message: 'Download forbidden: access not approved' });
    if (!fs.existsSync(document.filePath)) return res.status(404).json({ message: 'File missing from server' });

    res.download(path.resolve(document.filePath), `${document.title}${path.extname(document.filePath)}`);
  } catch (error) {
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
};
