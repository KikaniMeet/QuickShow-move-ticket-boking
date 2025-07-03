import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Create the uploads directory if it doesn't exist
const uploadPath = path.resolve('uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Set up multer for file storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  res.status(200).json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

export default router;
