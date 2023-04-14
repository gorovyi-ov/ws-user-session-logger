exports.up = async (pgm) => {
  await pgm.db.query(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id SERIAL PRIMARY KEY,
      socket_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      session_id TEXT NOT NULL,
      session_start TIMESTAMP DEFAULT NOW(),
      session_end TIMESTAMP
    );
  `);

  await pgm.db.query(`
    CREATE TABLE IF NOT EXISTS user_logs (
      id SERIAL PRIMARY KEY,
      socket_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      session_id TEXT NOT NULL,
      action TEXT NOT NULL,
      details JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

exports.down = async (pgm) => {
  await pgm.db.query(`
    DROP TABLE IF EXISTS user_logs;
  `);

  await pgm.db.query(`
    DROP TABLE IF EXISTS user_sessions;
  `);
};
