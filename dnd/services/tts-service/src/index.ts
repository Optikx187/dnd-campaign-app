import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// TTS Synthesis
app.post('/api/tts/synthesize', async (req, res) => {
  try {
    const { text, voice, rate, pitch } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Missing required field: text' });
    }

    const provider = process.env.TTS_PROVIDER || 'webspeech';

    if (provider === 'elevenlabs' && process.env.ELEVENLABS_API_KEY) {
      // Use ElevenLabs API
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString('base64');
      
      res.json({
        audio: audioBase64,
        format: 'mp3',
        provider: 'elevenlabs',
        timestamp: new Date().toISOString(),
      });
    } else {
      // Web Speech API - return text for client-side synthesis
      res.json({
        text,
        voice: voice || 'default',
        rate: rate || 1,
        pitch: pitch || 1,
        provider: 'webspeech',
        message: 'Use Web Speech API on the client side for synthesis',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

// Health Check
app.get('/api/tts/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'tts-service',
    provider: process.env.TTS_PROVIDER || 'webspeech',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Text-to-Speech Service - D&D Companion' });
});

app.listen(PORT, () => {
  console.log(`TTS Service running on port ${PORT}`);
});
