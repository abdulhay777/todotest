const { Router } = require('express')
const passport = require('passport')

const { SignIn, SignUp, Data } = require('../controllers/api/users')

const router = Router()

// Роутер для логина
router.post('/sign-in', SignIn)

// Роутер для регистрации
router.post('/sign-up', SignUp)

// Передаем данные о пользователе
router.get('/data', passport.authenticate('jwt', {session: false}), Data)

module.exports = router