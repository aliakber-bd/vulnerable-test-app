const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Hardcoded secrets
const JWT_SECRET = 'my-secret-key-12345';
const ENCRYPTION_KEY = 'hardcoded-encryption-key';

class AuthService {
    // Weak password hashing
    hashPassword(password) {
        return crypto.createHash('md5').update(password).digest('hex');
    }

    // JWT with weak secret
    generateToken(userId) {
        return jwt.sign({ userId: userId }, JWT_SECRET);
    }

    // No token validation
    validateToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (e) {
            return null;
        }
    }

    // Insecure session management
    createSession(user) {
        const sessionId = Math.random().toString(36);
        return {
            id: sessionId,
            user: user,
            createdAt: new Date()
        };
    }

    // Password storage in plain text
    storePassword(username, password) {
        const fs = require('fs');
        const data = username + ':' + password + '\n';
        fs.appendFileSync('passwords.txt', data);
    }

    // Timing attack vulnerability
    comparePasswords(input, stored) {
        if (input.length !== stored.length) {
            return false;
        }
        for (let i = 0; i < input.length; i++) {
            if (input[i] !== stored[i]) {
                return false;
            }
        }
        return true;
    }
}

module.exports = new AuthService();
