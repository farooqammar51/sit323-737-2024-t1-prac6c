const express = require('express');
const path = require('path');

const app = express();
const PORT = process .env.PORT || 3000

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve your HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Web server running at: http://localhost:${PORT}`)
    console.log("Type Ctrl+C to shut down the web server")
});