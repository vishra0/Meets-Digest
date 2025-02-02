const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/meetsdigest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema for meeting notes
const meetingNoteSchema = new mongoose.Schema({
    transcript: String,
    summary: String,
    createdAt: { type: Date, default: Date.now },
});

const MeetingNote = mongoose.model('MeetingNote', meetingNoteSchema);

// OpenAI Configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Route to handle transcription and summarization
app.post('/api/summarize', async (req, res) => {
    const { transcript } = req.body;

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Summarize the following meeting transcript:\n\n${transcript}\n\nSummary:`,
            max_tokens: 100,
        });

        const summary = response.data.choices[0].text.trim();

        // Save to MongoDB
        const newNote = new MeetingNote({ transcript, summary });
        await newNote.save();

        res.json({ summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while summarizing the transcript.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});