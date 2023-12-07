export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
    port: process.env.PORT || 5050,
    client_url: process.env.CLIENT_URL || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET || 'djijd&@*(&@!jdao--1',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || 465,
    smtpAuth: {
        user: process.env.SMTP_USER || 'youremail,
        pass: process.env.SMTP_PASS || 'smtp_pass'
    }
}
