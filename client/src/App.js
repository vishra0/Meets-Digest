import React , { useState } from 'react' ;
import axios from 'axios' ;

function App(){
  const [transcript, setTranscript] = useState('');
    const [summary, setSummary] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recognition, setRecognition] = useState(null);

    const startRecording = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setTranscript(transcript);
        };

        recognition.start();
        setIsRecording(true);
        setRecognition(recognition);
    };

    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
            setIsRecording(false);
        }
    };

    const handleSummarize = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/summarize', { transcript });
            setSummary(response.data.summary);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="App">
            <h1>Meets Digest</h1>
            <div>
                <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
                <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
            </div>
            <div>
                <h2>Transcript</h2>
                <p>{transcript}</p>
            </div>
            <div>
                <button onClick={handleSummarize}>Summarize</button>
            </div>
            <div>
                <h2>Summary</h2>
                <p>{summary}</p>
            </div>
        </div>
    );
}
export default App;