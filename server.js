const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();

const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the path to your db.json file
const dbFilePath = path.join(__dirname, 'db.json');

// Function to generate a unique ID for a new note
function generateUniqueID(notes) {
  let newID;
  do {
    newID = uuidv4();
  } while (notes.some((note) => note.id === newID));
  return newID;
}

// API route to get all saved notes
app.get('/api/notes', (req, res) => {
  // Read the contents of the db.json file
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes from the database.' });
    }
    // Parse the JSON data and send it as a response
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// API route to add a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body; // Get the new note data from the request body

  // Read existing notes from the db.json file
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes from the database.' });
    }

    // Parse the JSON data and add the new note
    const notes = JSON.parse(data);
    newNote.id = generateUniqueID(notes); // Generate a unique ID for the note
    notes.push(newNote);

    // Write the updated notes back to the db.json file
    fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to write notes to the database.' });
      }
      // Respond with the new note
      res.json(newNote);
    });
  });
});

// Define a route to serve the 'notes.html' page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Define a catch-all route to serve the 'index.html' page for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server and listen on the defined port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
