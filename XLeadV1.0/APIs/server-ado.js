const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { queryDatabase } = require('./db-ado');
 
// Initialize express app
const app = express();
const port = process.env.PORT || 3000;
 
// Middleware
app.use(cors());
app.use(bodyParser.json());
 
// Root route - API health check
app.get('/', (req, res) => {
  res.json({ message: 'XLead API is running' });
});
 
// GET all contacts - simple and direct
app.get('/api/deal_info', async (req, res) => {
  try {
    // Simple query to get exactly what we need
    const sql = `
      SELECT * FROM deal_info`;
   
    const results = await queryDatabase(sql);
    console.log(`Retrieved ${results.length} contacts`);
    res.json(results);
  } catch (err) {
    console.error('Error fetching deals:', err);
    res.status(500).json({ error: err.message });
  }
});
 
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Test the API at http://localhost:${port}/api/deal_info`);
});