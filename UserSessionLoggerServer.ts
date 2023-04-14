const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 5432,
});

const server = http.createServer();
const io = new Server(server);

io.on('connection', (socket) => {
  let userId;
  let sessionId;

  socket.on('session-start', async ({ userId: uid, sessionId: sid }) => {
    userId = uid;
    sessionId = sid;

    await pool.query(
      'INSERT INTO user_sessions (socket_id, user_id, session_id, session_start) VALUES ($1, $2, $3, $4)',
      [socket.id, userId, sessionId, new Date()]
    );
  });

  socket.on('session-end', async () => {
    await pool.query(
      'UPDATE user_sessions SET session_end = $1 WHERE socket_id = $2 AND user_id = $3 AND session_id = $4',
      [new Date(), socket.id, userId, sessionId]
    );

    userId = null;
    sessionId = null;
  });

  socket.on('navigation', async ({ userId: uid, sessionId: sid, page }) => {
    await pool.query(
      'INSERT INTO user_logs (socket_id, user_id, session_id, action, details) VALUES ($1, $2, $3, $4, $5)',
      [socket.id, uid, sid, 'Navigate', { page }]
    );
  });

  socket.on('button-clicked', async ({ userId: uid, sessionId: sid, action, details }) => {
    await pool.query(
      'INSERT INTO user_logs (socket_id, user_id, session_id, action, details) VALUES ($1, $2, $3, $4, $5)',
      [socket.id, uid, sid, action, details]
    );
  });
});

server.listen(8080);
