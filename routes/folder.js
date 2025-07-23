const express = require("express");
const router = express.Router();
const Folder = require("../models/Folder");
const fetchuser = require("../middleware/fetchuser");

// Create Folder (optionally nested)
router.post("/create", fetchuser, async (req, res) => {
  try {
    const { name, parent = null } = req.body;
    const folder = new Folder({
      name,
      parent,
      owner: req.user.id,
    });
    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Get folders by parent (or root if parent not passed)
router.get("/", fetchuser, async (req, res) => {
  try {
    const parent = req.query.parent === "null" || !req.query.parent ? null : req.query.parent;
    const folders = await Folder.find({ owner: req.user.id, parent });
    res.json(folders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Rename a folder
router.put("/:id", fetchuser, async (req, res) => {
  try {
    const { name } = req.body;
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { name },
      { new: true }
    );
    if (!folder) return res.status(404).send("Folder not found");
    res.json(folder);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a folder (and optionally its children)
router.delete("/:id", fetchuser, async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!folder) return res.status(404).send("Folder not found");

    // Recursively delete child folders
    await Folder.deleteMany({ parent: req.params.id });

    res.json({ message: "Folder deleted", folder });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
