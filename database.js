const mysql = require('mysql');

// Hardcoded database credentials
const DB_CONFIG = {
    host: 'prod-db.example.com',
    user: 'admin',
    password: 'Admin@123456',
    database: 'production_db',
    port: 3306
};

class Database {
    constructor() {
        this.connection = mysql.createConnection(DB_CONFIG);
    }

    // SQL injection vulnerabilities
    getUserById(id) {
        const query = `SELECT * FROM users WHERE id = ${id}`;
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    searchUsers(searchTerm) {
        const query = "SELECT * FROM users WHERE name LIKE '%" + searchTerm + "%'";
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    // Dynamic query building with concatenation
    updateUser(userId, updates) {
        let query = "UPDATE users SET ";
        const fields = [];
        for (let key in updates) {
            fields.push(key + " = '" + updates[key] + "'");
        }
        query += fields.join(', ');
        query += " WHERE id = " + userId;

        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    // NoSQL injection (if using MongoDB)
    findUser(username, password) {
        const query = {
            username: username,
            password: password
        };
        // Vulnerable to NoSQL injection
        return query;
    }

    // Mass assignment vulnerability
    createUser(userData) {
        const query = "INSERT INTO users SET ?";
        return new Promise((resolve, reject) => {
            this.connection.query(query, userData, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = new Database();
