import createDebug from 'debug';
import 'dotenv/config';
import { createServer } from 'http';
import { app } from './app.js';
import { databaseConnect } from './db/database.connect.js';

const debug = createDebug('WolfTracks: Index');

const PORT = process.env.PORT ?? 7373;

const server = createServer(app);

databaseConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('Connected to DB:', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error', error);
  });

server.on('listening', () => {
  console.log(`Listening on port ${PORT}`);
});

server.on('error', (error) => {
  console.log(`Error en index: ${error.message}`);
});
