const express = require('express');
const router = express.Router();
const File = require('../models/File');
const fetchuser = require('../middleware/fetchuser');

// Get files by parent (or root if parent not passed)
router.get('/', fetchuser, async (req, res) => {
  try {
    const parent = req.query.parent === "null" || !req.query.parent ? null : req.query.parent;
    const files = await File.find({ owner: req.user.id, parent });
    res.json(files);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Upload a file by URL
router.post('/upload', fetchuser, async (req, res) => {
  try {
    const { name, url, parent = null } = req.body;

    if (!url || !name) {
      return res.status(400).json({ error: 'Name and URL are required' });
    }

    const file = new File({
      name,
      url,
      owner: req.user.id,
      folder: parent,
    });

    await file.save();
    res.status(201).json(file);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Upload failed');
  }
});

// Update image name
router.put('/:id', fetchuser, async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { name: req.body.name },
      { new: true }
    );
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json(file);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Update failed');
  }
});

// Delete image from DB
router.delete('/:id', fetchuser, async (req, res) => {
  try {
    const file = await File.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!file) return res.status(404).json({ error: 'File not found' });

    res.json({ message: 'File record deleted', file });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Delete failed');
  }
});

module.exports = router;
