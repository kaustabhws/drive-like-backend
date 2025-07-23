const mongoose = require("mongoose");
const { Schema } = mongoose;

const FileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", FileSchema);
