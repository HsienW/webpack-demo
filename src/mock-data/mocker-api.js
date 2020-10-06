module.exports = {
    'GET /user': {
        name: 'demo user name'
    },
    'POST /login/account': (request, respond) => {
        const {password, username} = request.body
        if (password === 'this-demo' && username === 'this-demo') {
            return respond.send({
                status: 'ok',
                code: 200,
                token: 'demo-token',
                data: {
                    id: 1,
                    name: 'demo user name'
                }
            })
        } else {
            return respond.send({
                status: 'error',
                code: 400
            })
        }
    }
}
