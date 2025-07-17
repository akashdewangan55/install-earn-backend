require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model
const AppSchema = new mongoose.Schema({
    name: String,
    description: String,
    bonus: Number,
    icon: String,
    link: String
});
const App = mongoose.model('App', AppSchema);

// API Routes

// Get all apps
app.get('/api/apps', async (req, res) => {
    try {
        const apps = await App.find();
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new app
app.post('/api/apps', async (req, res) => {
    const { name, description, bonus, icon, link } = req.body;
    try {
        const newApp = new App({ name, description, bonus, icon, link });
        await newApp.save();
        res.status(201).json({ message: "App added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit app
app.put('/api/apps/:id', async (req, res) => {
    const { name, description, bonus, icon, link } = req.body;
    try {
        await App.findByIdAndUpdate(req.params.id, { name, description, bonus, icon, link });
        res.json({ message: "App updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete app
app.delete('/api/apps/:id', async (req, res) => {
    try {
        await App.findByIdAndDelete(req.params.id);
        res.json({ message: "App deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
