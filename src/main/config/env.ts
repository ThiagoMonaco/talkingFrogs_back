export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/talkingfrogs',
    port: process.env.PORT || 5050,
    jwtSecret: process.env.JWT_SECRET || 'djijd&@*(&@!jdao--1'
}