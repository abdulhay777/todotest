const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const validateEmail = require('../app/email-valid')
const {JWT, JWT_time} = require('../../config/config')

const Lists = require('../../models/lists')
const Users = require('../../models/users')

// Роутер для логина
module.exports.SignIn = async (req, res) => {

    const email = req.body.email ? req.body.email : false
    const password = req.body.password ? req.body.password : false

    if (!email) {
        res.status(404).json({
            message: {
                En: 'Email empty',
                Ru: 'Адрес электронной почты пустой'
            }
        })
        return
    }

    if (!password) {
        res.status(404).json({
            message: {
                En: 'Password empty',
                Ru: 'Пароль пустой'
            }
        })
        return
    }

    if (!validateEmail(email)) {
        res.status(400).json({
            message: {
                En: 'Invalid email address',
                Ru: 'Невалидный электронный адрес'
            }
        })
        return
    }

    const users = await Users.findOne({email: email}).lean()

    if (!users) {
        res.status(404).json({
            message: {
                En: 'User with this email address was not found',
                Ru: 'Пользователь с таким электронным адресом не найден'
            }
        })
        return
    }

    const passwordResult = bcryptjs.compareSync(password, users.password)

    if (passwordResult) {

        const token = jwt.sign({
            id: users._id,
            email: users.email
        }, JWT, {expiresIn: JWT_time})


        res.status(201).json({
            token: `Bearer ${token}`
        })

    } else {
        res.status(401).json({
            message: {
                En: 'Password is incorrect',
                Ru: 'Пароль неправильный'
            }
        })
        return
    }

}

// Роутер для регистрации
module.exports.SignUp = async (req, res) => {

    const email = req.body.email ? req.body.email : false
    const password = req.body.password ? req.body.password : false
    const name = req.body.name ? req.body.name : false

    if (!email) {
        res.status(404).json({
            message: {
                En: 'Email empty',
                Ru: 'Адрес электронной почты пустой'
            }
        })
        return
    }

    if (!password) {
        res.status(404).json({
            message: {
                En: 'Password empty',
                Ru: 'Пароль пустой'
            }
        })
        return
    }

    if (!name) {
        res.status(404).json({
            message: {
                En: 'Name empty',
                Ru: 'Имя пустой'
            }
        })
    }

    if (!validateEmail(email)) {
        res.status(400).json({
            message: {
                En: 'Invalid email address',
                Ru: 'Невалидный электронный адрес'
            }
        })
        return
    }

    const isEmail = await Users.findOne({email: email}).lean()

    if (isEmail) {
        res.status(409).json({
            message: {
                En: 'This email already exists',
                Ru: 'Этот адрес электронной почты уже существует'
            }
        })
        return
    } else {

        const salt = bcryptjs.genSaltSync(10)

        let users = new Users({
            email: email,
            password: bcryptjs.hashSync(password, salt),
            name: name,
        })

        try {

            await users.save()

            const token = jwt.sign({
                email: users.email,
                id: users._id
            }, JWT, {expiresIn: JWT_time})

            res.status(201).json({
                token: `Bearer ${token}`
            })

        } catch (error) {
            res.status(500).json({
                message: {
                    En: 'Server error',
                    Ru: 'Ошибка сервера'
                }
            })
        }

    }

}

module.exports.Data = async (req, res) => {
    
    if (req.user.id) {
        const lists = await Lists.find({author: req.user.id}).lean()
        const userData = await Users.findOne({_id: req.user.id}).lean()

        let data = {
            lists: lists,
            user: userData
        }

        res.status(200).json(data)
    } else {
        res.status(500).json({error: true})
    }

}