const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const connectToMongo = require('./db');
connectToMongo();

const app = express();
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('🚀 CloudDrive backend is running!');
});

app.use('/api/auth', require('./routes/auth'))
app.use('/api/folders', require('./routes/folder'));
app.use('/api/files', require('./routes/files'));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 Server listening at http://localhost:${port}`);
});
