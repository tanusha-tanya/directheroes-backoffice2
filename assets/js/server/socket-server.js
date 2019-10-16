const socketPouchServer = require('socket-pouch/server');

socketPouchServer.listen(3000, {
  remoteUrl: 'https://couchdb.app02.beta.directheroes.com/'
});
// const PouchDB = require('pouchdb');
// const PouchSync = require('pouch-websocket-sync');
// const http = require('http');
// const httpServer = http.createServer();
// const server = PouchSync.createServer(httpServer, onRequest);
// httpServer.listen(3000);

// function onRequest(credentials, dbName, cb) {
//   // console.log(credentials, dbName, cb);
//   const pouchDB = new PouchDB(`https://couchdb.app02.beta.directheroes.com/${ dbName }`)

//   cb(null, pouchDB);

//   // if (credentials.token == 'some token') {
//   //   cb(null, new PouchDB(dbName));
//   // } else {
//   //   cb(new Error('not allowed'));
//   // }
// };