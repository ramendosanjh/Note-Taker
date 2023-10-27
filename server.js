const express = require('express');
const path = require('path');
const api = require('./routes/index.js');

const PORT = process.env.PORT|| 3001;// Define the port for the server

const app = express(); // Create an Express application

// GET Route for notes page
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use API routes defined in the 'api' module
app.use('/api', api);

// Serve static files from the 'public' directory (HTML, CSS, JavaScript, etc.)
app.use(express.static('public'));

// Define a route to serve the 'notes.html' page
app.get('/notes', (req, res) => {
 // Send the 'notes.html' file located in the 'public' directory
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Define a catch-all route to serve the 'index.html' page for other routes
app.get('*', (req, res) => {

 // Send the 'index.html' file located in the 'public' directory
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server and listen on the defined port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);