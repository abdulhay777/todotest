const {PORT, DB_CONNECT, JWT, corsOptions} = require('./config/config')

const cors = require('cors')
const mongoose = require('mongoose')
const socketioJwt = require('socketio-jwt')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: corsOptions,
    allowEIO3: true
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(cors(corsOptions))

require('./middleware/passport')(passport)

/**
 * Подключаем все роутры
 */
app.use('/api/users', require('./routes/users.routes'))

/**
 * В socket.io добавляем jwt token
 */
io.use(socketioJwt.authorize({secret: JWT, handshake: true}))

io.on('connection', (socket) => {

    socket.join(socket.decoded_token.id)

    require('./controllers/socket/add.project')(socket, io)
    require('./controllers/socket/delete.project')(socket, io)

})

/**
 * Запуск сервера
 */
const startServer = async () => {
    try {

        await mongoose.connect(DB_CONNECT, ({
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }))

        server.listen(PORT, () => {
            console.log(`Start server port: ${PORT}`)
        })

    } catch (e) {
        console.log(e);
    }
}

startServer()