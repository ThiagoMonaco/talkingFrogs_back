export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/talkingfrogs',
    port: process.env.PORT || 5050,
    jwtSecret: process.env.JWT_SECRET || 'djijd&@*(&@!jdao--1',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || 465,
    smtpAuth: {
        user: process.env.SMTP_USER || 'talkingfrogsdev@gmail.com',
        pass: process.env.SMTP_PASS || 'zxictupsfkevbaea'
    }
}