const express = require('express');
const cors = require('cors');
require('dotenv').config();

const avalancheService = require('./services/avalanche');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Bulletin AVAX API is running',
    version: '1.0.0',
    endpoints: {
      l1s: '/api/l1s',
      health: '/'
    }
  });
});

// Get all L1 networks
app.get('/api/l1s', async (req, res) => {
  try {
    const l1Data = await avalancheService.getL1Data();
    res.json(l1Data);
  } catch (error) {
    console.error('Error fetching L1 data:', error.message);
    res.status(500).json({
      error: 'Failed to fetch L1 data',
      message: error.message
    });
  }
});

// Get specific L1 by ID
app.get('/api/l1s/:id', async (req, res) => {
  try {
    const l1Data = await avalancheService.getL1Data();
    const l1 = l1Data.l1s.find(l => l.id === req.params.id);

    if (!l1) {
      return res.status(404).json({ error: 'L1 not found' });
    }

    res.json(l1);
  } catch (error) {
    console.error('Error fetching L1:', error.message);
    res.status(500).json({
      error: 'Failed to fetch L1',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Bulletin AVAX API running on port ${PORT}`);
  console.log(`📋 API endpoints available at http://localhost:${PORT}`);
});