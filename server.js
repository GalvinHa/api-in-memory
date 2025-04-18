// server.js
// A simple Express.js backend for a Todo list API
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to include static content from 'public' folder
app.use(express.static('public'));

// In-memory array to store todo items
let todos = [];
let nextId = 1;

// Serve index.html from 'public' at the '/' path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET all todo items at the '/todos' path
app.get('/todos', (req, res) => {
  res.json(todos);
});

// GET a specific todo item by ID
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(item => item.id === id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo item not found' });
  }
});

// POST a new todo item
app.post('/todos', (req, res) => {
  const { name, priority = 'low', isFun } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  const newTodo = {
    id: nextId++,
    name,
    priority,
    isComplete: false,
    isFun
  };
  
  todos.push(newTodo);
  
  // Log every incoming TODO item in a 'todo.log' file @ the root of the project
  fs.appendFile('todo.log', JSON.stringify(newTodo) + '\n', (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
  
  res.status(201).json(newTodo);
});

// DELETE a todo item by ID
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(item => item.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    res.json({ message: `Todo item ${id} deleted.` });
  } else {
    res.status(404).json({ message: 'Todo item not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});