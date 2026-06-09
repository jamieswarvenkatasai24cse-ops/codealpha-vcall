import express from 'express';

const router = express.Router();
const files = new Map();

router.post('/upload', (req, res) => {
  try {
    const fileId = Date.now().toString();
    files.set(fileId, {
      id: fileId,
      fileName: req.body.fileName,
      fileSize: req.body.fileSize,
      uploadedBy: req.user.id,
      uploadedAt: new Date(),
      data: req.body.data
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      fileId,
      downloadUrl: `/api/files/download/${fileId}`
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

router.get('/download/:fileId', (req, res) => {
  try {
    const file = files.get(req.params.fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
    res.send(Buffer.from(file.data, 'base64'));
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ error: 'File download failed' });
  }
});

export default router;
