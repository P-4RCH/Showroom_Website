// index.js

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'products_xkb3_user',
  host: 'dpg-cps3iv08fa8c7390qqr0-a',
  database: 'products_xkb3',
  password: 'p1aatHO7lWQTCpqD4orzy4ilBUtlhave',
  port: 5432, // Default PostgreSQL port
});

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as view engine
app.set('view engine', 'ejs');

// Static folder
app.use(express.static('public'));

// Routes
app.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM products');
    const products = result.rows;
    client.release();
    res.render('index', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/add-product', (req, res) => {
  res.render('add-product');
});

app.post('/add-product', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const client = await pool.connect();
    const queryText = 'INSERT INTO products(name, description, price) VALUES($1, $2, $3)';
    await client.query(queryText, [name, description, price]);
    client.release();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

