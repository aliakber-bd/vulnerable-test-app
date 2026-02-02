const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SQL Injection vulnerability
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'testdb'
    });

    // Direct SQL injection
    const query = "SELECT * FROM users WHERE id = '" + userId + "'";
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Command Injection vulnerability
app.post('/execute', (req, res) => {
    const command = req.body.cmd;
    // Direct command execution with user input
    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.status(500).send(error.message);
            return;
        }
        res.send(stdout);
    });
});

// XSS vulnerability
app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
    // Reflected XSS
    res.send('<h1>Search Results for: ' + searchTerm + '</h1>');
});

// Path Traversal vulnerability
app.get('/file', (req, res) => {
    const fs = require('fs');
    const filename = req.query.name;
    // Direct file access without sanitization
    fs.readFile('/var/www/files/' + filename, 'utf8', (err, data) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }
        res.send(data);
    });
});

// Insecure deserialization
app.post('/deserialize', (req, res) => {
    const serialize = require('serialize-javascript');
    const data = req.body.data;
    // Dangerous eval usage
    const obj = eval('(' + data + ')');
    res.json(obj);
});

// Hardcoded credentials
const DB_PASSWORD = 'SuperSecret123!';
const API_KEY = 'sk_live_1234567890abcdef';
const AWS_SECRET = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

// Weak cryptography
const crypto = require('crypto');
app.post('/encrypt', (req, res) => {
    const cipher = crypto.createCipher('des', 'weak-key');
    let encrypted = cipher.update(req.body.text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    res.send(encrypted);
});

// SSRF vulnerability
app.get('/fetch', (req, res) => {
    const axios = require('axios');
    const url = req.query.url;
    axios.get(url).then(response => {
        res.send(response.data);
    }).catch(err => {
        res.status(500).send(err.message);
    });
});

// Insecure random number generation
app.get('/token', (req, res) => {
    const token = Math.random().toString(36).substring(7);
    res.json({ token: token });
});

// XXE vulnerability
app.post('/parse-xml', (req, res) => {
    const xml2js = require('xml2js');
    const parser = new xml2js.Parser({
        // XXE enabled
        strict: false,
        normalize: false,
        explicitArray: false
    });

    parser.parseString(req.body.xml, (err, result) => {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(result);
    });
});

// Unsafe redirect
app.get('/redirect', (req, res) => {
    const target = req.query.url;
    res.redirect(target);
});

// Missing authentication
app.delete('/admin/user/:id', (req, res) => {
    const userId = req.params.id;
    // Delete user without authentication
    res.send('User ' + userId + ' deleted');
});

// Information disclosure
app.get('/error', (req, res) => {
    try {
        throw new Error('Database connection failed: mysql://admin:password@localhost:3306/prod_db');
    } catch (e) {
        res.status(500).send(e.stack);
    }
});

app.listen(3000, () => {
    console.log('Vulnerable app listening on port 3000');
});
