const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticate, authorize } = require('../middleware/auth');
const {
  uploadDocument,
  listDocuments,
  updateDocument,
  deleteDocument,
  downloadDocument,
} = require('../controllers/documentController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get('/', authenticate, listDocuments);
router.post('/', authenticate, authorize('ADMIN'), upload.single('file'), uploadDocument);
router.put('/:id', authenticate, authorize('ADMIN'), updateDocument);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteDocument);
router.get('/:id/download', authenticate, downloadDocument);

module.exports = router;
