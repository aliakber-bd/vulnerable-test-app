# Vulnerable Test Application

This is a test application intentionally created with multiple security vulnerabilities for testing security scanning tools.

## Vulnerabilities Included

- SQL Injection
- Command Injection
- XSS (Cross-Site Scripting)
- Path Traversal
- Insecure Deserialization
- Hardcoded Credentials
- Weak Cryptography
- SSRF (Server-Side Request Forgery)
- XXE (XML External Entity)
- Unsafe Redirects
- Missing Authentication
- Information Disclosure
- Vulnerable Dependencies

## Setup

```bash
npm install
node app.js
```

**WARNING: DO NOT deploy this application to production. It is intentionally vulnerable.**
