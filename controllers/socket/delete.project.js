const Lists = require('../../models/lists')

module.exports = function (socket, io) {

    socket.on('IN_ListDelete', async (data) => {
        
        const list_id = data._id
        const user_id = socket.decoded_token.id

        await Lists.deleteOne({_id: list_id}, (err) => {
            if (err) {
                return console.error(err)
            }
        })

        io.in(user_id).emit('OUT_ListDelete', {
            list_id: list_id,
            user_id: socket.decoded_token.id
        })

    })

}