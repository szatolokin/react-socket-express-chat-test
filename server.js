const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const path = require('path');

{
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'index.html'));
        console.log('Send html');
    });

    app.get('/dist/style.css', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist/style.css'));
        console.log('Send css');
    });

    app.get('/dist/main.js', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist/main.js'));
        console.log('Send js');
    });

    http.listen(9090, () => {
        console.log('App start');
    });
}

{
    const createID = (() => {
        let freeID = 0;
        return () => freeID++;
    })();

    const serverID = createID();

    const messages = [
        {
            userID: serverID,
            id: createID(),
            text: 'Добро пожаловать!',
        },
    ];

    io.on('connection', socket => {
        const userID = createID();
        
        console.log(`User ${userID} connected`);
        
        {
            socket.emit('init', userID);
            socket.emit('messages', messages);
        }

        {
            socket.on('message', message => {
                console.log(message);

                message.id = createID();
                messages.push(message);

                io.emit('messages', messages);
            });
        }

        socket.on('disconnect', () => {
            console.log(`User ${userID} disconnect`);
        });
    });
}
