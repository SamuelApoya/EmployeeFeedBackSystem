const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Use express.json() to parse JSON bodies
app.use(express.json());

// Connect to MongoDB (make sure to have MongoDB installed and running)
mongoose.connect('mongodb://localhost:27017/feedbackDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Create a mongoose schema for feedback
const feedbackSchema = new mongoose.Schema({
    text: String,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// API endpoint to save feedback
app.post('/api/feedback', async (req, res) => {
    const feedbackText = req.body.text;

    if (!feedbackText) {
        return res.status(400).json({ error: 'Feedback text is required.' });
    }

    try {
        const newFeedback = new Feedback({
            text: feedbackText,
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback saved successfully.' });
    } catch (error) {
        console.error('Error saving feedback to the database:', error);
        res.status(500).json({ error: 'Error saving feedback to the database.' });
    }
});

// Catch-all middleware for handling other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'employee_feedback.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
