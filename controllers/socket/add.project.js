const Lists = require('../../models/lists')

module.exports = function (socket, io) {

    socket.on('IN_ListAdd', async (data) => {

        try {

            const name = data.name
            const id = data._id
            
            console.log(data)
    
            if (!name) {
                io.to(socket.decoded_token.id).emit('OUT_Message', {
                    message: 'Name empty'
                })
                return
            }
    
            const list = new Lists({
                _id: id,
                name: name,
                author: socket.decoded_token.id,
            })

            await list.save()

            io.to(socket.decoded_token.id).emit('OUT_ListAdd', project)

        } catch (error) {
            io.to(socket.decoded_token.id).emit('OUT_Message', {
                message: 'Server error'
            })
        }

    })

}
