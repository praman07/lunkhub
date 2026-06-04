import { Server } from 'socket.io';

const voteCounts = {}
const sockets = [];

export default function initSocket(httpServer) {

    const io = new Server(httpServer);

    io.on('connection', (socket) => {

        const { room } = socket.handshake.query;
        console.log(`User joined room: ${room}`);
        socket.join(room);

        if (!voteCounts[ room ]) {
            voteCounts[ room ] = { yes: 0, no: 0 };
        }


        socket.on("vote_yes", () => {

            if (sockets.includes(socket.id)) {
                return;
            }

            voteCounts[ room ].yes += 1;
            io.to(room).emit("vote_update", voteCounts[ room ]);

            sockets.push(socket.id);
        })

        socket.on("vote_no", () => {

            if (sockets.includes(socket.id)) {
                return;
            }

            voteCounts[ room ].no += 1;
            io.to(room).emit("vote_update", voteCounts[ room ]);
            sockets.push(socket.id);
        })

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

}