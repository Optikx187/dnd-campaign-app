import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

// Initialize ChromaDB client
const chromaHost = process.env.CHROMA_HOST || 'localhost';
const chromaPort = process.env.CHROMA_PORT || '8000';
const chroma = new ChromaClient({ path: `http://${chromaHost}:${chromaPort}` });

// Create a simple embedding function (using a dummy implementation for now)
class SimpleEmbeddingFunction {
  async generate(texts: string[]) {
    // Return simple hash-based embeddings as placeholder
    return texts.map(text => 
      text.split('').map(c => c.charCodeAt(0) / 255)
    );
  }
}

const embedder = new SimpleEmbeddingFunction();

// Store conversation
app.post('/api/memory/store', async (req, res) => {
  try {
    const { campaignId, role, message, metadata } = req.body;

    if (!campaignId || !role || !message) {
      return res.status(400).json({ error: 'Missing required fields: campaignId, role, message' });
    }

    // Get or create collection
    const collectionName = `campaign_${campaignId}`;
    let collection;
    try {
      collection = await chroma.getCollection({ name: collectionName, embeddingFunction: embedder });
    } catch {
      collection = await chroma.createCollection({ name: collectionName, embeddingFunction: embedder });
    }

    // Add document to collection
    await collection.add({
      documents: [message],
      metadatas: [{ role, timestamp: new Date().toISOString(), ...(metadata || {}) }],
      ids: [`${Date.now()}_${role}`],
    });

    res.json({
      success: true,
      message: 'Conversation stored successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error storing conversation:', error);
    res.status(500).json({ error: 'Failed to store conversation' });
  }
});

// Retrieve relevant context
app.post('/api/memory/retrieve', async (req, res) => {
  try {
    const { campaignId, query, nResults = 5 } = req.body;

    if (!campaignId || !query) {
      return res.status(400).json({ error: 'Missing required fields: campaignId, query' });
    }

    // Get collection
    const collectionName = `campaign_${campaignId}`;
    let collection;
    try {
      collection = await chroma.getCollection({ name: collectionName, embeddingFunction: embedder });
    } catch {
      return res.json({
        context: [],
        message: 'No conversation history found for this campaign',
      });
    }

    // Query collection
    const results = await collection.query({
      queryTexts: [query],
      nResults,
    });

    const context = results.documents[0]?.map((doc, i) => ({
      message: doc,
      metadata: results.metadatas[0]?.[i] || {},
    })) || [];

    res.json({
      context,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error retrieving context:', error);
    res.status(500).json({ error: 'Failed to retrieve context' });
  }
});

// Health Check
app.get('/api/memory/health', async (req, res) => {
  try {
    // Test ChromaDB connection
    await chroma.heartbeat();
    res.json({
      status: 'healthy',
      service: 'memory-service',
      chromaHost,
      chromaPort,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'memory-service',
      error: 'ChromaDB connection failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Memory Service - D&D Companion' });
});

app.listen(PORT, () => {
  console.log(`Memory Service running on port ${PORT}`);
});
