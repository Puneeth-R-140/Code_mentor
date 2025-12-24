const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const analyzeRoute = require('./routes/analyze');
const executeRoute = require('./routes/execute');

app.use('/api/analyze', analyzeRoute);
app.use('/api/execute', executeRoute);

// Health Check
app.get('/', (req, res) => {
    res.send('Real-Time Code Mentor API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
