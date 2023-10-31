const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve the 'notes.html' page
app.get('notes.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});


// Define a route to serve the 'notes.html' page
app.get('notes.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/public','notes.html'));
});

// Define a catch-all route to serve the 'index.html' page for other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public','index.html'));
});

// Define the path to your db.json file
const dbFilePath = path.join(__dirname, 'db.json');

app.get('/api/notes', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes from the database.' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes from the database.' });
    }
    const notes = JSON.parse(data);
    newNote.id = generateUniqueID(notes);
    notes.push(newNote);
    fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to write notes to the database.' });
      }
      res.json(newNote);
    });
  });
});


// Helper function to generate a unique ID
function generateUniqueID(notes) {
  let newID;
  do {
    newID = uuidv4();
  } while (notes.some((note) => note.id === newID));
  return newID;
}

// Create a new note
app.post('/api/notes', (req, res) => {
  const newNote = { id: uuidv4(), ...req.body };
  const dbFilePath = path.join(__dirname,'/db/db.json');
  const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  notes.push(newNote);
  fs.writeFileSync(dbFilePath, JSON.stringify(notes));
  res.json(newNote);
});

// Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const dbFilePath = path.join(__dirname, 'db', 'db.json');
  const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  const updatedNotes = notes.filter((note) => note.id !== id);
  fs.writeFileSync(dbFilePath, JSON.stringify(updatedNotes));
  res.json({ message: 'Note deleted successfully' });
});

// Start the server and listen on the defined port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);