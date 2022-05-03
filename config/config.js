module.exports = {
    PORT: process.env.PORT || 7777,
    DB_CONNECT: 'mongodb+srv://bruce:HX!HetN67jV@cluster0.zcm24.mongodb.net/test_work',
    JWT: 'dev',
    JWT_time: (60 * 60) * 24,
    corsOptions: {
        origin: '*',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        optionsSucccessStatus: 200,
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'device-remember-token',
            'Access-Control-Allow-Origin',
            'Origin',
            'Accept',
        ],
    }
}