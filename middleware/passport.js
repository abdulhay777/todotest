const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const {JWT} = require('../config/config')

const Users = require('../models/users')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT
}

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const users = await Users.findById(payload.id).select('id')
                if (users) {
                    done(null, users)
                } else {
                    done(null, false)
                }
            } catch (error) {
                console.log(error)
            }
        })
    )
}